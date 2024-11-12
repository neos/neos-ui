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

use Neos\ContentRepository\Core\DimensionSpace\OriginDimensionSpacePoint;
use Neos\ContentRepository\Core\Feature\NodeDuplication\Command\CopyNodesRecursively;
use Neos\ContentRepository\Core\Feature\NodeMove\Command\MoveNodeAggregate;
use Neos\ContentRepository\Core\Feature\NodeMove\Dto\RelationDistributionStrategy;
use Neos\ContentRepository\Core\Feature\NodeRemoval\Command\RemoveNodeAggregate;
use Neos\ContentRepository\Core\Projection\ContentGraph\Node;
use Neos\ContentRepository\Core\Projection\ContentGraph\VisibilityConstraints;
use Neos\ContentRepository\Core\SharedModel\Node\NodeVariantSelectionStrategy;
use Neos\Neos\Ui\Domain\Model\Feedback\Operations\UpdateNodeInfo;

/**
 * @internal These objects internally reflect possible operations made by the Neos.Ui.
 *           They are sorely an implementation detail. You should not use them!
 *           Please look into the php command API of the Neos CR instead.
 */
class MoveInto extends AbstractStructuralChange
{
    protected ?string $parentContextPath;

    public function setParentContextPath(string $parentContextPath): void
    {
        $this->parentContextPath = $parentContextPath;
    }

    public function getParentNode(): ?Node
    {
        if ($this->parentContextPath === null) {
            return null;
        }

        return $this->nodeService->findNodeBySerializedNodeAddress(
            $this->parentContextPath
        );
    }


    /**
     * Get the insertion mode (before|after|into) that is represented by this change
     */
    public function getMode(): string
    {
        return 'into';
    }

    /**
     * Checks whether this change can be applied to the subject
     */
    public function canApply(): bool
    {
        $parent = $this->getParentNode();

        return $parent && $this->isNodeTypeAllowedAsChildNode($parent, $this->subject->nodeTypeName);
    }

    /**
     * Applies this change
     */
    public function apply(): void
    {
        // "parentNode" is the node where the $subject should be moved INTO
        $parentNode = $this->getParentNode();
        // "subject" is the to-be-moved node
        $subject = $this->subject;
        if ($this->canApply() && $parentNode) {
            $otherParent = $this->contentRepositoryRegistry->subgraphForNode($subject)
                ->findParentNode($subject->aggregateId);

            $hasEqualParentNode = $otherParent && $otherParent->aggregateId
                    ->equals($parentNode->aggregateId);

            $contentRepository = $this->contentRepositoryRegistry->get($subject->contentRepositoryId);
            if (!$parentNode->dimensionSpacePoint->equals($subject->dimensionSpacePoint)) {
                // WORKAROUND for MOVE ACROSS DIMENSIONS:
                // - we want it to work like a copy/paste, followed by an original delete.
                // - This is to ensure the user can use it as expected from text editors, where context
                //   is not preserved during cut/paste.
                // - LATERON, we need to expose CreateNodeVariant (which creates connected variants) in the UI as well.
                $command = CopyNodesRecursively::createFromSubgraphAndStartNode(
                    $contentRepository->getContentGraph($subject->workspaceName)->getSubgraph(
                        $subject->dimensionSpacePoint,
                        VisibilityConstraints::withoutRestrictions()
                    ),
                    $subject->workspaceName,
                    $subject,
                    // NOTE: in order to be able to copy/paste across dimensions, we need to use
                    // the TARGET NODE's DimensionSpacePoint to create the node in the target dimension.
                    OriginDimensionSpacePoint::fromDimensionSpacePoint($parentNode->dimensionSpacePoint),
                    $parentNode->aggregateId,
                    null
                );
                $contentRepository->handle($command);

                $command = RemoveNodeAggregate::create(
                    $subject->workspaceName,
                    $subject->aggregateId,
                    $subject->dimensionSpacePoint,
                    NodeVariantSelectionStrategy::STRATEGY_ALL_SPECIALIZATIONS,
                );
                $contentRepository->handle($command);
            } else {
                $contentRepository->handle(
                    MoveNodeAggregate::create(
                        $subject->workspaceName,
                        $subject->dimensionSpacePoint,
                        $subject->aggregateId,
                        RelationDistributionStrategy::STRATEGY_GATHER_ALL,
                        $hasEqualParentNode ? null : $parentNode->aggregateId,
                    )
                );
            }

            $updateParentNodeInfo = new UpdateNodeInfo();
            $updateParentNodeInfo->setNode($parentNode);
            $this->feedbackCollection->add($updateParentNodeInfo);

            $this->finish($subject);
        }
    }
}
