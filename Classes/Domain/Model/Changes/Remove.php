<?php
declare(strict_types=1);
namespace Neos\Neos\Ui\Domain\Model\Changes;

/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

use Neos\ContentRepository\Core\DimensionSpace\Exception\DimensionSpacePointNotFound;
use Neos\ContentRepository\Core\Feature\NodeRemoval\Command\RemoveNodeAggregate;
use Neos\ContentRepository\Core\Feature\SubtreeTagging\Command\TagSubtree;
use Neos\ContentRepository\Core\Feature\SubtreeTagging\Dto\SubtreeTag;
use Neos\ContentRepository\Core\Projection\ContentGraph\Filter\FindAncestorNodesFilter;
use Neos\ContentRepository\Core\Projection\ContentGraph\Filter\FindClosestNodeFilter;
use Neos\ContentRepository\Core\Projection\ContentGraph\VisibilityConstraints;
use Neos\ContentRepository\Core\SharedModel\Exception\ContentStreamDoesNotExistYet;
use Neos\ContentRepository\Core\SharedModel\Exception\NodeAggregatesTypeIsAmbiguous;
use Neos\ContentRepository\Core\SharedModel\Node\NodeAggregateId;
use Neos\ContentRepository\Core\SharedModel\Node\NodeVariantSelectionStrategy;
use Neos\Neos\Domain\Service\NodeTypeNameFactory;
use Neos\Neos\PendingChangesProjection\ChangeFinder;
use Neos\Neos\PendingChangesProjection\Changes;
use Neos\Neos\Ui\Domain\Model\AbstractChange;
use Neos\Neos\Ui\Domain\Model\Feedback\Messages\Error;
use Neos\Neos\Ui\Domain\Model\Feedback\Operations\RemoveNode;
use Neos\Neos\Ui\Domain\Model\Feedback\Operations\UpdateNodeInfo;

/**
 * Removes a node
 * @internal These objects internally reflect possible operations made by the Neos.Ui.
 *           They are sorely an implementation detail. You should not use them!
 *           Please look into the php command API of the Neos CR instead.
 */
class Remove extends AbstractChange
{
    /**
     * Checks whether this change can be applied to the subject
     *
     * @return boolean
     */
    public function canApply(): bool
    {
        return true;
    }

    /**
     * Applies this change
     *
     * @throws NodeAggregatesTypeIsAmbiguous
     * @throws ContentStreamDoesNotExistYet
     * @throws DimensionSpacePointNotFound
     */
    public function apply(): void
    {
        $subject = $this->subject;
        if ($this->canApply()) {
            $parentNode = $this->findParentNode($subject);
            if (is_null($parentNode)) {
                throw new \InvalidArgumentException(
                    'Cannot apply Remove without a parent on node ' . $subject->aggregateId->value,
                    1645560717
                );
            }

            // we have to schedule and the update workspace info before we actually delete the node;
            // otherwise we cannot find the parent nodes anymore.
            $this->updateWorkspaceInfo();

            if ($this->nodeRequiresSoftDeletion()) {
                $this->softDeleteNode();
                $contentRepository = $this->contentRepositoryRegistry->get($this->subject->contentRepositoryId);
                $subgraph = $contentRepository->getContentGraph($this->subject->workspaceName)->getSubgraph($this->subject->dimensionSpacePoint, VisibilityConstraints::withoutRestrictions());
                $node = $subgraph->findNodeById($this->subject->aggregateId);

                if ($node) {
                    $updateNodeInfo = new UpdateNodeInfo();
                    $updateNodeInfo->setNode($node);
                    $this->feedbackCollection->add($updateNodeInfo);
                }

                $error = new Error();
                $error->setMessage(sprintf('Could not remove node %s because its children contain changes. Please publish or discard them first. Node was disabled instead.', $this->subject->aggregateId->value));
                $this->feedbackCollection->add($error);

                $this->reloadDocument();
            } else {
                $this->hardDeleteNode();

                $removeNode = new RemoveNode($subject, $parentNode);
                $this->feedbackCollection->add($removeNode);

                $updateParentNodeInfo = new UpdateNodeInfo();
                $updateParentNodeInfo->setNode($parentNode);

                $this->feedbackCollection->add($updateParentNodeInfo);
            }
        }
    }

    private function nodeRequiresSoftDeletion(): bool
    {
        $contentRepository = $this->contentRepositoryRegistry->get($this->subject->contentRepositoryId);
        $workspace = $contentRepository->findWorkspaceByName($this->subject->workspaceName);

        $subgraph = $contentRepository->getContentGraph($this->subject->workspaceName)->getSubgraph($this->subject->dimensionSpacePoint, VisibilityConstraints::withoutRestrictions());
        $baseSubgraph = $contentRepository->getContentGraph($workspace->baseWorkspaceName)->getSubgraph($this->subject->dimensionSpacePoint, VisibilityConstraints::withoutRestrictions());

        /** @var Changes $changes */
        $changes = $contentRepository->projectionState(ChangeFinder::class)->findByContentStreamId($workspace->currentContentStreamId);

        foreach ($changes as $change) {
            if ($change->nodeAggregateId->equals($this->subject->aggregateId) && $change->created) {
                // Case 1. The node was just created and thus might have newly created child nodes or modifications on the node that need to be published first
                return true;
            }
            // todo work across dimensions by taking the correct change dsp
            if ($change->created || $change->deleted || $change->changed) {
                if ($subgraph->findAncestorNodes($change->nodeAggregateId, FindAncestorNodesFilter::create())->toNodeAggregateIds()->contain($this->subject->aggregateId)) {
                    // Case 2. The nodes children were changed
                    return true;
                }
            }
            // todo this doesnt work if the node was only temporary moved into this tree part once but doesnt reside here anymore today and never has in the base workspace!
            if ($change->moved) {
                if ($baseSubgraph->findAncestorNodes($change->nodeAggregateId, FindAncestorNodesFilter::create())->toNodeAggregateIds()->contain($this->subject->aggregateId)) {
                    // Case 3. The node was moved out of this node
                    return true;
                }
            }
        }

        return false;
    }

    private function softDeleteNode(): void
    {
        $command = TagSubtree::create(
            $this->subject->workspaceName,
            $this->subject->aggregateId,
            $this->subject->dimensionSpacePoint,
            NodeVariantSelectionStrategy::STRATEGY_ALL_SPECIALIZATIONS,
            SubtreeTag::disabled()
        );

        $contentRepository = $this->contentRepositoryRegistry->get($this->subject->contentRepositoryId);
        $contentRepository->handle($command);
    }

    private function hardDeleteNode(): void
    {
        $command = RemoveNodeAggregate::create(
            $this->subject->workspaceName,
            $this->subject->aggregateId,
            $this->subject->dimensionSpacePoint,
            NodeVariantSelectionStrategy::STRATEGY_ALL_SPECIALIZATIONS,
        );
        $removalAttachmentPoint = $this->getRemovalAttachmentPoint();
        if ($removalAttachmentPoint !== null) {
            $command = $command->withRemovalAttachmentPoint($removalAttachmentPoint);
        }

        $contentRepository = $this->contentRepositoryRegistry->get($this->subject->contentRepositoryId);
        $contentRepository->handle($command);
    }

    private function getRemovalAttachmentPoint(): ?NodeAggregateId
    {
        $subgraph = $this->contentRepositoryRegistry->subgraphForNode($this->subject);

        if ($this->getNodeType($this->subject)?->isOfType(NodeTypeNameFactory::NAME_DOCUMENT)) {
            $closestSiteNode = $subgraph->findClosestNode($this->subject->aggregateId, FindClosestNodeFilter::create(nodeTypes: NodeTypeNameFactory::NAME_SITE));
            return $closestSiteNode?->aggregateId;
        }

        $closestDocumentParentNode = $subgraph->findClosestNode($this->subject->aggregateId, FindClosestNodeFilter::create(nodeTypes: NodeTypeNameFactory::NAME_DOCUMENT));
        return $closestDocumentParentNode?->aggregateId;
    }
}
