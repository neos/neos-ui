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
use Neos\ContentRepository\Core\Projection\ContentGraph\VisibilityConstraints;
use Neos\ContentRepository\Core\SharedModel\Node\NodeName;

/**
 * @internal These objects internally reflect possible operations made by the Neos.Ui.
 *           They are sorely an implementation detail. You should not use them!
 *           Please look into the php command API of the Neos CR instead.
 */
class CopyAfter extends AbstractStructuralChange
{
    /**
     * "Subject" is the to-be-copied node; the "sibling" node is the node after which the "Subject" should be copied.
     *
     * @return boolean
     */
    public function canApply(): bool
    {
        if (is_null($this->subject)) {
            return false;
        }
        $siblingNode = $this->getSiblingNode();
        if (is_null($siblingNode)) {
            return false;
        }
        $nodeType = $this->subject->nodeType;
        $parentNode = $this->findParentNode($siblingNode);
        return !is_null($parentNode)
            && $this->isNodeTypeAllowedAsChildNode($parentNode, $nodeType);
    }

    public function getMode(): string
    {
        return 'after';
    }

    /**
     * Applies this change
     */
    public function apply(): void
    {
        $previousSibling = $this->getSiblingNode();
        $parentNodeOfPreviousSibling = !is_null($previousSibling)
            ? $this->findParentNode($previousSibling)
            : null;
        $subject = $this->subject;

        if ($this->canApply() && $subject && !is_null($previousSibling) && !is_null($parentNodeOfPreviousSibling)) {
            $succeedingSibling = null;
            try {
                $succeedingSibling = $this->findChildNodes($parentNodeOfPreviousSibling)->next($previousSibling);
            } catch (\InvalidArgumentException $e) {
                // do nothing; $succeedingSibling is null.
            }

            $targetNodeName = NodeName::fromString(uniqid('node-'));

            $contentRepository = $this->contentRepositoryRegistry->get($subject->subgraphIdentity->contentRepositoryId);
            $workspace = $contentRepository->getWorkspaceFinder()->findOneByCurrentContentStreamId($subject->subgraphIdentity->contentStreamId);
            if (!$workspace) {
                throw new \Exception('Could not find workspace for content stream', 1699004343);
            }
            $command = CopyNodesRecursively::createFromSubgraphAndStartNode(
                $contentRepository->getContentGraph()->getSubgraph(
                    $subject->subgraphIdentity->contentStreamId,
                    $subject->subgraphIdentity->dimensionSpacePoint,
                    VisibilityConstraints::withoutRestrictions()
                ),
                $workspace->workspaceName,
                $subject,
                OriginDimensionSpacePoint::fromDimensionSpacePoint($subject->subgraphIdentity->dimensionSpacePoint),
                $parentNodeOfPreviousSibling->nodeAggregateId,
                $succeedingSibling?->nodeAggregateId,
                $targetNodeName
            );
            $contentRepository->handle($command)->block();

            $newlyCreatedNode = $this->contentRepositoryRegistry->subgraphForNode($parentNodeOfPreviousSibling)
                ->findNodeByPath(
                    $targetNodeName,
                    $parentNodeOfPreviousSibling->nodeAggregateId
                );
            $this->finish($newlyCreatedNode);
            // NOTE: we need to run "finish" before "addNodeCreatedFeedback"
            // to ensure the new node already exists when the last feedback is processed
            $this->addNodeCreatedFeedback($newlyCreatedNode);
        }
    }
}
