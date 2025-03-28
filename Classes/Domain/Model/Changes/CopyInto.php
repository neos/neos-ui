<?php

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
use Neos\ContentRepository\Core\Projection\ContentGraph\Node;
use Neos\ContentRepository\Core\SharedModel\Node\NodeAggregateId;
use Neos\Neos\Domain\Service\NodeDuplication\NodeAggregateIdMapping;
use Neos\Neos\Domain\Service\NodeDuplicationService;
use Neos\Flow\Annotations as Flow;

/**
 * @internal These objects internally reflect possible operations made by the Neos.Ui.
 *           They are sorely an implementation detail. You should not use them!
 *           Please look into the php command API of the Neos CR instead.
 */
class CopyInto extends AbstractStructuralChange
{
    #[Flow\Inject()]
    protected NodeDuplicationService $nodeDuplicationService;

    protected ?string $parentContextPath;

    protected ?Node $cachedParentNode = null;

    public function setParentContextPath(string $parentContextPath): void
    {
        $this->parentContextPath = $parentContextPath;
    }

    public function getParentNode(): ?Node
    {
        if (!isset($this->cachedParentNode)) {
            $this->cachedParentNode = $this->parentContextPath
                ? $this->nodeService->findNodeBySerializedNodeAddress($this->parentContextPath)
                : null;
        }

        return $this->cachedParentNode;
    }

    /**
     * "Subject" is the to-be-copied node; the "parent" node is the new parent
     */
    public function canApply(): bool
    {
        $parentNode = $this->getParentNode();

        return $parentNode && $this->isNodeTypeAllowedAsChildNode($parentNode, $this->subject->nodeTypeName);
    }

    public function getMode(): string
    {
        return 'into';
    }

    /**
     * Applies this change
     */
    public function apply(): void
    {
        $subject = $this->getSubject();
        $parentNode = $this->getParentNode();
        if ($parentNode && $this->canApply()) {
            if (!$subject->dimensionSpacePoint->equals($parentNode->dimensionSpacePoint)) {
                throw new \RuntimeException('Copying across dimensions is not supported yet (https://github.com/neos/neos-development-collection/issues/5054)', 1733586265);
            }
            $this->nodeDuplicationService->copyNodesRecursively(
                $subject->contentRepositoryId,
                $subject->workspaceName,
                $subject->dimensionSpacePoint,
                $subject->aggregateId,
                OriginDimensionSpacePoint::fromDimensionSpacePoint($parentNode->dimensionSpacePoint),
                $parentNode->aggregateId,
                null,
                NodeAggregateIdMapping::createEmpty()
                    ->withNewNodeAggregateId($subject->aggregateId, $newlyCreatedNodeId = NodeAggregateId::create())
            );

            $newlyCreatedNode = $this->contentRepositoryRegistry->subgraphForNode($parentNode)
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
