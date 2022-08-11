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

use Neos\ContentRepository\SharedModel\Node\NodeName;
use Neos\ContentRepository\SharedModel\Node\OriginDimensionSpacePoint;
use Neos\ContentRepository\SharedModel\VisibilityConstraints;
use Neos\ContentRepository\Projection\ContentGraph\NodeInterface;
use Neos\Flow\Annotations as Flow;
use Neos\ContentRepository\Feature\NodeDuplication\Command\CopyNodesRecursively;
use Neos\ContentRepository\Feature\NodeDuplication\NodeDuplicationCommandHandler;

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
        $nodeType = $this->subject->getNodeType();
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

            $contentRepository = $this->contentRepositoryRegistry->get($subject->getSubgraphIdentity()->contentRepositoryIdentifier);
            $command = CopyNodesRecursively::create(
                $contentRepository->getContentGraph()->getSubgraphByIdentifier(
                    $subject->getSubgraphIdentity()->contentStreamIdentifier,
                    $subject->getSubgraphIdentity()->dimensionSpacePoint,
                    VisibilityConstraints::withoutRestrictions()
                ),
                $subject,
                OriginDimensionSpacePoint::fromDimensionSpacePoint($subject->getSubgraphIdentity()->dimensionSpacePoint),
                $this->getInitiatingUserIdentifier(),
                $parentNodeOfPreviousSibling->getNodeAggregateIdentifier(),
                $succeedingSibling?->getNodeAggregateIdentifier(),
                $targetNodeName
            );
            $contentRepository->handle($command)->block();


            /** @var NodeInterface $newlyCreatedNode */
            $newlyCreatedNode = $this->nodeAccessorFor($parentNodeOfPreviousSibling)
                ->findChildNodeConnectedThroughEdgeName(
                    $parentNodeOfPreviousSibling,
                    $targetNodeName
                );
            $this->finish($newlyCreatedNode);
            // NOTE: we need to run "finish" before "addNodeCreatedFeedback"
            // to ensure the new node already exists when the last feedback is processed
            $this->addNodeCreatedFeedback($newlyCreatedNode);
        }
    }
}
