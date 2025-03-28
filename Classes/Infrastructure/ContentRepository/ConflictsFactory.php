<?php

/*
 * This file is part of the Neos.Neos package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

declare(strict_types=1);

namespace Neos\Neos\Ui\Infrastructure\ContentRepository;

use Neos\ContentRepository\Core\ContentRepository;
use Neos\ContentRepository\Core\DimensionSpace\DimensionSpacePoint;
use Neos\ContentRepository\Core\DimensionSpace\DimensionSpacePointSet;
use Neos\ContentRepository\Core\EventStore\EventInterface;
use Neos\ContentRepository\Core\Feature\NodeCreation\Event\NodeAggregateWithNodeWasCreated;
use Neos\ContentRepository\Core\Feature\NodeModification\Event\NodePropertiesWereSet;
use Neos\ContentRepository\Core\Feature\NodeMove\Event\NodeAggregateWasMoved;
use Neos\ContentRepository\Core\Feature\NodeReferencing\Event\NodeReferencesWereSet;
use Neos\ContentRepository\Core\Feature\NodeRemoval\Event\NodeAggregateWasRemoved;
use Neos\ContentRepository\Core\Feature\NodeTypeChange\Event\NodeAggregateTypeWasChanged;
use Neos\ContentRepository\Core\Feature\NodeVariation\Event\NodeGeneralizationVariantWasCreated;
use Neos\ContentRepository\Core\Feature\NodeVariation\Event\NodePeerVariantWasCreated;
use Neos\ContentRepository\Core\Feature\SubtreeTagging\Event\SubtreeWasTagged;
use Neos\ContentRepository\Core\Feature\SubtreeTagging\Event\SubtreeWasUntagged;
use Neos\ContentRepository\Core\Feature\WorkspaceRebase\ConflictingEvent;
use Neos\ContentRepository\Core\Feature\WorkspaceRebase\Exception\WorkspaceRebaseFailed;
use Neos\ContentRepository\Core\NodeType\NodeTypeManager;
use Neos\ContentRepository\Core\Projection\ContentGraph\ContentSubgraphInterface;
use Neos\ContentRepository\Core\Projection\ContentGraph\Filter\FindClosestNodeFilter;
use Neos\ContentRepository\Core\Projection\ContentGraph\Node;
use Neos\ContentRepository\Core\Projection\ContentGraph\NodeAggregate;
use Neos\ContentRepository\Core\SharedModel\Exception\NodeAggregateCurrentlyDoesNotExist;
use Neos\ContentRepository\Core\SharedModel\Node\NodeAggregateId;
use Neos\ContentRepository\Core\SharedModel\Workspace\Workspace;
use Neos\ContentRepository\Core\SharedModel\Workspace\WorkspaceName;
use Neos\Flow\Annotations as Flow;
use Neos\Flow\Utility\Algorithms;
use Neos\Neos\Domain\NodeLabel\NodeLabelGeneratorInterface;
use Neos\Neos\Domain\Service\NodeTypeNameFactory;
use Neos\Neos\Ui\Application\Shared\Conflict;
use Neos\Neos\Ui\Application\Shared\Conflicts;
use Neos\Neos\Ui\Application\Shared\IconLabel;
use Neos\Neos\Ui\Application\Shared\ReasonForConflict;
use Neos\Neos\Ui\Application\Shared\TypeOfChange;

/**
 * @internal
 */
#[Flow\Proxy(false)]
final class ConflictsFactory
{
    private NodeTypeManager $nodeTypeManager;

    private ?Workspace $workspace;

    public function __construct(
        private readonly ContentRepository $contentRepository,
        private readonly NodeLabelGeneratorInterface $nodeLabelGenerator,
        WorkspaceName $workspaceName,
        private readonly ?DimensionSpacePoint $preferredDimensionSpacePoint,
    ) {
        $this->nodeTypeManager = $contentRepository->getNodeTypeManager();

        $this->workspace = $contentRepository->findWorkspaceByName($workspaceName);
    }

    public function fromWorkspaceRebaseFailed(
        WorkspaceRebaseFailed $workspaceRebaseFailed
    ): Conflicts {
        /** @var array<string,Conflict> */
        $conflictsByKey = [];

        foreach ($workspaceRebaseFailed->conflictingEvents as $conflictingEvent) {
            $conflict = $this->createConflict($conflictingEvent);
            if (!array_key_exists($conflict->key, $conflictsByKey)) {
                // deduplicate if the conflict affects the same node
                $conflictsByKey[$conflict->key] = $conflict;
            }
        }

        return new Conflicts(...$conflictsByKey);
    }

    private function createConflict(
        ConflictingEvent $conflictingEvent
    ): Conflict {
        $nodeAggregateId = $conflictingEvent->getAffectedNodeAggregateId();
        $subgraph = $this->acquireSubgraph(
            $conflictingEvent->getEvent(),
            $nodeAggregateId
        );
        $affectedSite = $nodeAggregateId
            ? $subgraph?->findClosestNode(
                $nodeAggregateId,
                FindClosestNodeFilter::create(nodeTypes: NodeTypeNameFactory::NAME_SITE)
            )
            : null;
        $affectedDocument = $nodeAggregateId
            ? $subgraph?->findClosestNode(
                $nodeAggregateId,
                FindClosestNodeFilter::create(nodeTypes: NodeTypeNameFactory::NAME_DOCUMENT)
            )
            : null;
        $affectedNode = $nodeAggregateId
            ? $subgraph?->findNodeById($nodeAggregateId)
            : null;

        return new Conflict(
            key: $affectedNode
                ? $affectedNode->aggregateId->value
                : Algorithms::generateUUID(),
            affectedSite: $affectedSite
                ? $this->createIconLabelForNode($affectedSite)
                : null,
            affectedDocument: $affectedDocument
                ? $this->createIconLabelForNode($affectedDocument)
                : null,
            affectedNode: $affectedNode
                ? $this->createIconLabelForNode($affectedNode)
                : null,
            typeOfChange: $this->createTypeOfChange(
                $conflictingEvent->getEvent()
            ),
            reasonForConflict: $this->createReasonForConflictFromException(
                $conflictingEvent->getException()
            )
        );
    }

    private function acquireSubgraph(
        EventInterface $event,
        ?NodeAggregateId $nodeAggregateIdForDimensionFallback
    ): ?ContentSubgraphInterface {
        if ($this->workspace === null) {
            return null;
        }

        $dimensionSpacePoint = match ($event::class) {
            NodeAggregateWasMoved::class =>
                // TODO it seems the event lost some information here from the intention
                self::firstDimensionSpacePoint($event->succeedingSiblingsForCoverage->toDimensionSpacePointSet()),
            NodePropertiesWereSet::class,
            NodeAggregateWithNodeWasCreated::class =>
                $event->originDimensionSpacePoint->toDimensionSpacePoint(),
            NodeReferencesWereSet::class =>
                // TODO it seems the event lost some information here from the intention
                self::firstDimensionSpacePoint($event->affectedSourceOriginDimensionSpacePoints->toDimensionSpacePointSet()),
            SubtreeWasTagged::class,
            SubtreeWasUntagged::class =>
                // TODO it seems the event lost some information here from the intention
                self::firstDimensionSpacePoint($event->affectedDimensionSpacePoints),
            NodeAggregateWasRemoved::class =>
                // TODO it seems the event lost some information here from the intention
                self::firstDimensionSpacePoint($event->affectedCoveredDimensionSpacePoints),
            NodeAggregateTypeWasChanged::class =>
                null,
            NodePeerVariantWasCreated::class =>
                $event->peerOrigin->toDimensionSpacePoint(),
            NodeGeneralizationVariantWasCreated::class =>
                $event->generalizationOrigin->toDimensionSpacePoint(),
            default => null
        };

        if ($dimensionSpacePoint === null) {
            if ($nodeAggregateIdForDimensionFallback === null) {
                return null;
            }

            $nodeAggregate = $this->contentRepository
                ->getContentGraph($this->workspace->workspaceName)
                ->findNodeAggregateById($nodeAggregateIdForDimensionFallback);

            if ($nodeAggregate) {
                $dimensionSpacePoint = $this->extractValidDimensionSpacePointFromNodeAggregate(
                    $nodeAggregate
                );
            }
        }

        if ($dimensionSpacePoint === null) {
            return null;
        }

        return $this->contentRepository->getContentSubgraph(
            $this->workspace->workspaceName,
            $dimensionSpacePoint,
        );
    }

    private function extractValidDimensionSpacePointFromNodeAggregate(
        NodeAggregate $nodeAggregate
    ): ?DimensionSpacePoint {
        $result = null;

        foreach ($nodeAggregate->coveredDimensionSpacePoints as $coveredDimensionSpacePoint) {
            if ($this->preferredDimensionSpacePoint?->equals($coveredDimensionSpacePoint)) {
                return $coveredDimensionSpacePoint;
            }
            $result ??= $coveredDimensionSpacePoint;
        }

        return $result;
    }

    private function createIconLabelForNode(Node $node): IconLabel
    {
        $nodeType = $this->nodeTypeManager->getNodeType($node->nodeTypeName);

        return new IconLabel(
            icon: $nodeType?->getConfiguration('ui.icon') ?? 'questionmark',
            label: $this->nodeLabelGenerator->getLabel($node),
        );
    }

    private function createTypeOfChange(
        EventInterface $event
    ): ?TypeOfChange {
        return match ($event::class) {
            NodeAggregateWithNodeWasCreated::class,
            NodePeerVariantWasCreated::class,
            NodeGeneralizationVariantWasCreated::class =>
                TypeOfChange::NODE_HAS_BEEN_CREATED,
            NodePropertiesWereSet::class,
            NodeReferencesWereSet::class,
            SubtreeWasTagged::class,
            SubtreeWasUntagged::class,
            NodeAggregateTypeWasChanged::class =>
                TypeOfChange::NODE_HAS_BEEN_CHANGED,
            NodeAggregateWasMoved::class =>
                TypeOfChange::NODE_HAS_BEEN_MOVED,
            NodeAggregateWasRemoved::class =>
                TypeOfChange::NODE_HAS_BEEN_DELETED,
            default => null
        };
    }

    private function createReasonForConflictFromException(
        \Throwable $exception
    ): ?ReasonForConflict {
        return match ($exception::class) {
            NodeAggregateCurrentlyDoesNotExist::class =>
                ReasonForConflict::NODE_HAS_BEEN_DELETED,
            default => null
        };
    }

    private static function firstDimensionSpacePoint(DimensionSpacePointSet $dimensionSpacePointSet): ?DimensionSpacePoint
    {
        foreach ($dimensionSpacePointSet->points as $point) {
            return $point;
        }
        return null;
    }
}
