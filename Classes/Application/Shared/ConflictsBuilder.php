<?php

/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

declare(strict_types=1);

namespace Neos\Neos\Ui\Application\Shared;

use Neos\ContentRepository\Core\CommandHandler\CommandInterface;
use Neos\ContentRepository\Core\ContentRepository;
use Neos\ContentRepository\Core\DimensionSpace\DimensionSpacePoint;
use Neos\ContentRepository\Core\Feature\NodeCreation\Command\CreateNodeAggregateWithNode;
use Neos\ContentRepository\Core\Feature\NodeCreation\Command\CreateNodeAggregateWithNodeAndSerializedProperties;
use Neos\ContentRepository\Core\Feature\NodeDisabling\Command\DisableNodeAggregate;
use Neos\ContentRepository\Core\Feature\NodeDisabling\Command\EnableNodeAggregate;
use Neos\ContentRepository\Core\Feature\NodeModification\Command\SetNodeProperties;
use Neos\ContentRepository\Core\Feature\NodeModification\Command\SetSerializedNodeProperties;
use Neos\ContentRepository\Core\Feature\NodeMove\Command\MoveNodeAggregate;
use Neos\ContentRepository\Core\Feature\NodeReferencing\Command\SetNodeReferences;
use Neos\ContentRepository\Core\Feature\NodeReferencing\Command\SetSerializedNodeReferences;
use Neos\ContentRepository\Core\Feature\NodeRemoval\Command\RemoveNodeAggregate;
use Neos\ContentRepository\Core\Feature\NodeTypeChange\Command\ChangeNodeAggregateType;
use Neos\ContentRepository\Core\Feature\NodeVariation\Command\CreateNodeVariant;
use Neos\ContentRepository\Core\Feature\SubtreeTagging\Command\TagSubtree;
use Neos\ContentRepository\Core\Feature\SubtreeTagging\Command\UntagSubtree;
use Neos\ContentRepository\Core\Feature\WorkspaceRebase\CommandThatFailedDuringRebase;
use Neos\ContentRepository\Core\NodeType\NodeTypeManager;
use Neos\ContentRepository\Core\Projection\ContentGraph\ContentSubgraphInterface;
use Neos\ContentRepository\Core\Projection\ContentGraph\Filter\FindClosestNodeFilter;
use Neos\ContentRepository\Core\Projection\ContentGraph\Node;
use Neos\ContentRepository\Core\Projection\ContentGraph\NodeAggregate;
use Neos\ContentRepository\Core\Projection\ContentGraph\VisibilityConstraints;
use Neos\ContentRepository\Core\SharedModel\Exception\NodeAggregateCurrentlyDoesNotExist;
use Neos\ContentRepository\Core\SharedModel\Exception\WorkspaceDoesNotExist;
use Neos\ContentRepository\Core\SharedModel\Node\NodeAggregateId;
use Neos\ContentRepository\Core\SharedModel\Workspace\WorkspaceName;
use Neos\Flow\Annotations as Flow;
use Neos\Neos\Domain\NodeLabel\NodeLabelGeneratorInterface;
use Neos\Neos\Domain\Service\NodeTypeNameFactory;

/**
 * @internal
 */
#[Flow\Proxy(false)]
final class ConflictsBuilder
{
    private NodeTypeManager $nodeTypeManager;

    /**
     * @var Conflict[]
     */
    private array $items = [];

    /**
     * @var array<string,Conflict>
     */
    private array $itemsByAffectedNodeAggregateId = [];

    public function __construct(
        private ContentRepository $contentRepository,
        private NodeLabelGeneratorInterface $nodeLabelGenerator,
        private WorkspaceName $workspaceName,
        private ?DimensionSpacePoint $preferredDimensionSpacePoint,
    ) {
        $this->nodeTypeManager = $contentRepository->getNodeTypeManager();
    }

    public function addCommandThatFailedDuringRebase(
        CommandThatFailedDuringRebase $commandThatFailedDuringRebase
    ): void {
        $nodeAggregateId = $this->extractNodeAggregateIdFromCommand(
            $commandThatFailedDuringRebase->command
        );

        if ($nodeAggregateId && isset($this->itemsByAffectedNodeAggregateId[$nodeAggregateId->value])) {
            return;
        }

        $conflict = $this->createConflictFromCommandThatFailedDuringRebase(
            $commandThatFailedDuringRebase
        );

        $this->items[] = $conflict;

        if ($nodeAggregateId) {
            $this->itemsByAffectedNodeAggregateId[$nodeAggregateId->value] = $conflict;
        }
    }

    public function build(): Conflicts
    {
        return new Conflicts(...$this->items);
    }

    private function createConflictFromCommandThatFailedDuringRebase(
        CommandThatFailedDuringRebase $commandThatFailedDuringRebase
    ): Conflict {
        $nodeAggregateId = $this->extractNodeAggregateIdFromCommand(
            $commandThatFailedDuringRebase->command
        );
        $subgraph = $this->acquireSubgraphFromCommand(
            $commandThatFailedDuringRebase->command,
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
            affectedSite: $affectedSite
                ? $this->createIconLabelForNode($affectedSite)
                : null,
            affectedDocument: $affectedDocument
                ? $this->createIconLabelForNode($affectedDocument)
                : null,
            affectedNode: $affectedNode
                ? $this->createIconLabelForNode($affectedNode)
                : null,
            typeOfChange: $this->createTypeOfChangeFromCommand(
                $commandThatFailedDuringRebase->command
            ),
            reasonForConflict: $this->createReasonForConflictFromException(
                $commandThatFailedDuringRebase->exception
            )
        );
    }

    private function extractNodeAggregateIdFromCommand(CommandInterface $command): ?NodeAggregateId
    {
        return match (true) {
            $command instanceof MoveNodeAggregate,
            $command instanceof SetNodeProperties,
            $command instanceof SetSerializedNodeProperties,
            $command instanceof CreateNodeAggregateWithNode,
            $command instanceof CreateNodeAggregateWithNodeAndSerializedProperties,
            $command instanceof TagSubtree,
            $command instanceof DisableNodeAggregate,
            $command instanceof UntagSubtree,
            $command instanceof EnableNodeAggregate,
            $command instanceof RemoveNodeAggregate,
            $command instanceof ChangeNodeAggregateType,
            $command instanceof CreateNodeVariant =>
                $command->nodeAggregateId,
            $command instanceof SetNodeReferences,
            $command instanceof SetSerializedNodeReferences =>
                $command->sourceNodeAggregateId,
            default => null
        };
    }

    private function acquireSubgraphFromCommand(
        CommandInterface $command,
        ?NodeAggregateId $nodeAggregateIdForDimensionFallback
    ): ?ContentSubgraphInterface {
        try {
            $contentGraph = $this->contentRepository->getContentGraph($this->workspaceName);
        } catch (WorkspaceDoesNotExist) {
            return null;
        }

        $dimensionSpacePoint = match (true) {
            $command instanceof MoveNodeAggregate =>
                $command->dimensionSpacePoint,
            $command instanceof SetNodeProperties,
            $command instanceof SetSerializedNodeProperties,
            $command instanceof CreateNodeAggregateWithNode,
            $command instanceof CreateNodeAggregateWithNodeAndSerializedProperties =>
                $command->originDimensionSpacePoint->toDimensionSpacePoint(),
            $command instanceof SetNodeReferences,
            $command instanceof SetSerializedNodeReferences =>
                $command->sourceOriginDimensionSpacePoint->toDimensionSpacePoint(),
            $command instanceof TagSubtree,
            $command instanceof DisableNodeAggregate,
            $command instanceof UntagSubtree,
            $command instanceof EnableNodeAggregate,
            $command instanceof RemoveNodeAggregate =>
                $command->coveredDimensionSpacePoint,
            $command instanceof ChangeNodeAggregateType =>
                null,
            $command instanceof CreateNodeVariant =>
                $command->targetOrigin->toDimensionSpacePoint(),
            default => null
        };

        if ($dimensionSpacePoint === null) {
            if ($nodeAggregateIdForDimensionFallback === null) {
                return null;
            }

            $nodeAggregate = $contentGraph
                ->findNodeAggregateById(
                    $nodeAggregateIdForDimensionFallback
                );

            if ($nodeAggregate) {
                $dimensionSpacePoint = $this->extractValidDimensionSpacePointFromNodeAggregate(
                    $nodeAggregate
                );
            }
        }

        if ($dimensionSpacePoint === null) {
            return null;
        }

        return $contentGraph->getSubgraph(
            $dimensionSpacePoint,
            VisibilityConstraints::withoutRestrictions()
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
            label: $this->nodeLabelGenerator->getLabel($node)
        );
    }

    private function createTypeOfChangeFromCommand(
        CommandInterface $command
    ): ?TypeOfChange {
        return match (true) {
            $command instanceof CreateNodeAggregateWithNode,
            $command instanceof CreateNodeAggregateWithNodeAndSerializedProperties,
            $command instanceof CreateNodeVariant =>
                TypeOfChange::NODE_HAS_BEEN_CREATED,
            $command instanceof SetNodeProperties,
            $command instanceof SetSerializedNodeProperties,
            $command instanceof SetNodeReferences,
            $command instanceof SetSerializedNodeReferences,
            $command instanceof TagSubtree,
            $command instanceof DisableNodeAggregate,
            $command instanceof UntagSubtree,
            $command instanceof EnableNodeAggregate,
            $command instanceof ChangeNodeAggregateType =>
                TypeOfChange::NODE_HAS_BEEN_CHANGED,
            $command instanceof MoveNodeAggregate =>
                TypeOfChange::NODE_HAS_BEEN_MOVED,
            $command instanceof RemoveNodeAggregate =>
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
}
