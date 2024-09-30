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
use Neos\ContentRepository\Core\Feature\WorkspaceRebase\Exception\WorkspaceRebaseFailed;
use Neos\ContentRepository\Core\NodeType\NodeTypeManager;
use Neos\ContentRepository\Core\Projection\ContentGraph\ContentSubgraphInterface;
use Neos\ContentRepository\Core\Projection\ContentGraph\Filter\FindClosestNodeFilter;
use Neos\ContentRepository\Core\Projection\ContentGraph\Node;
use Neos\ContentRepository\Core\Projection\ContentGraph\NodeAggregate;
use Neos\ContentRepository\Core\Projection\ContentGraph\VisibilityConstraints;
use Neos\ContentRepository\Core\Projection\Workspace\Workspace;
use Neos\ContentRepository\Core\SharedModel\Exception\NodeAggregateCurrentlyDoesNotExist;
use Neos\ContentRepository\Core\SharedModel\Node\NodeAggregateId;
use Neos\ContentRepository\Core\SharedModel\Workspace\WorkspaceName;
use Neos\Flow\Annotations as Flow;
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

        $this->workspace = $contentRepository->getWorkspaceFinder()
            ->findOneByName($workspaceName);
    }

    public function fromWorkspaceRebaseFailed(
        WorkspaceRebaseFailed $workspaceRebaseFailed
    ): Conflicts {
        $conflictsBuilder = Conflicts::builder();

        foreach ($workspaceRebaseFailed->commandsThatFailedDuringRebase as $commandThatFailedDuringRebase) {
            $conflict = $this->createConflictFromCommandThatFailedDuringRebase($commandThatFailedDuringRebase);
            $conflictsBuilder->addConflict($conflict);
        }

        return $conflictsBuilder->build();
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
            key: $affectedNode
                 ? $affectedNode->aggregateId->value
                : 'command-' . $commandThatFailedDuringRebase->sequenceNumber,
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
        if ($this->workspace === null) {
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

        return $this->contentRepository
            ->getContentGraph($this->workspace->workspaceName)
            ->getSubgraph(
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
            label: $this->nodeLabelGenerator->getLabel($node),
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
