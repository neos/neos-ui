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
use Neos\ContentRepository\Core\SharedModel\Node\NodeName;

/**
 * @internal These objects internally reflect possible operations made by the Neos.Ui.
 *           They are sorely an implementation detail. You should not use them!
 *           Please look into the php command API of the Neos CR instead.
 */
class CopyBefore extends AbstractStructuralChange
{
    /**
     * "Subject" is the to-be-copied node; the "sibling" node is the node after which the "Subject" should be copied.
     */
    public function canApply(): bool
    {
        $siblingNode = $this->getSiblingNode();
        if (is_null($siblingNode)) {
            return false;
        }
        $parentNode = $this->findParentNode($siblingNode);

        return $parentNode && $this->isNodeTypeAllowedAsChildNode($parentNode, $this->subject->nodeTypeName);
    }

    public function getMode(): string
    {
        return 'before';
    }

    /**
     * Applies this change
     *
     * @return void
     */
    public function apply(): void
    {
        $succeedingSibling = $this->getSiblingNode();
        $parentNodeOfSucceedingSibling = !is_null($succeedingSibling)
            ? $this->findParentNode($succeedingSibling)
            : null;
        $subject = $this->subject;
        if ($this->canApply() && !is_null($succeedingSibling)
            && !is_null($parentNodeOfSucceedingSibling)
        ) {
            $contentRepository = $this->contentRepositoryRegistry->get($subject->contentRepositoryId);
            $command = CopyNodesRecursively::createFromSubgraphAndStartNode(
                $contentRepository->getContentGraph($subject->workspaceName)->getSubgraph(
                    $subject->dimensionSpacePoint,
                    $subject->visibilityConstraints
                ),
                $subject->workspaceName,
                $subject,
                OriginDimensionSpacePoint::fromDimensionSpacePoint($subject->dimensionSpacePoint),
                $parentNodeOfSucceedingSibling->aggregateId,
                $succeedingSibling->aggregateId
            );

            $contentRepository->handle($command);

            $newlyCreatedNodeId = $command->nodeAggregateIdMapping->getNewNodeAggregateId($subject->aggregateId);
            assert($newlyCreatedNodeId !== null); // cannot happen
            $newlyCreatedNode = $this->contentRepositoryRegistry->subgraphForNode($parentNodeOfSucceedingSibling)
                ->findNodeById($newlyCreatedNodeId);
            if (!$newlyCreatedNode) {
                throw new \RuntimeException(sprintf('Node %s was not found after copy.', $newlyCreatedNodeId->value), 1716023308);
            }
            $this->finish($newlyCreatedNode);
            // NOTE: we need to run "finish" before "addNodeCreatedFeedback"
            // to ensure the new node already exists when the last feedback is processed
            $this->addNodeCreatedFeedback($newlyCreatedNode);
        }
    }
}
