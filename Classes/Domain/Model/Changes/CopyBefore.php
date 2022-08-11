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
use Neos\ContentRepository\Projection\ContentGraph\NodeInterface;
use Neos\Flow\Annotations as Flow;
use Neos\ContentRepository\Feature\NodeDuplication\Command\CopyNodesRecursively;
use Neos\ContentRepository\Feature\NodeDuplication\NodeDuplicationCommandHandler;
use Neos\ContentRepository\SharedModel\User\UserIdentifier;

class CopyBefore extends AbstractStructuralChange
{
    /**
     * "Subject" is the to-be-copied node; the "sibling" node is the node after which the "Subject" should be copied.
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
        $parentNode = $this->findParentNode($siblingNode);
        $nodeType = $this->subject->getNodeType();

        return !is_null($parentNode) && $this->isNodeTypeAllowedAsChildNode($parentNode, $nodeType);
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
        if ($this->canApply() && !is_null($subject) && !is_null($succeedingSibling)
            && !is_null($parentNodeOfSucceedingSibling)
        ) {
            $targetNodeName = NodeName::fromString(uniqid('node-'));

            $contentRepository = $this->contentRepositoryRegistry->get($subject->getSubgraphIdentity()->contentRepositoryIdentifier);
            $command = CopyNodesRecursively::create(
                $contentRepository->getContentGraph()->getSubgraphByIdentifier(
                    $subject->getSubgraphIdentity()->contentStreamIdentifier,
                    $subject->getSubgraphIdentity()->dimensionSpacePoint,
                    $subject->getSubgraphIdentity()->visibilityConstraints
                ),
                $subject,
                OriginDimensionSpacePoint::fromDimensionSpacePoint($subject->getSubgraphIdentity()->dimensionSpacePoint),
                UserIdentifier::forSystemUser(), // TODO
                $parentNodeOfSucceedingSibling->getNodeAggregateIdentifier(),
                $succeedingSibling->getNodeAggregateIdentifier(),
                $targetNodeName
            );
            $contentRepository->handle($command)->block();

            /** @var NodeInterface $newlyCreatedNode */
            $newlyCreatedNode = $this->nodeAccessorFor($parentNodeOfSucceedingSibling)
                ->findChildNodeConnectedThroughEdgeName(
                    $parentNodeOfSucceedingSibling,
                    $targetNodeName
                );
            $this->finish($newlyCreatedNode);
            // NOTE: we need to run "finish" before "addNodeCreatedFeedback"
            // to ensure the new node already exists when the last feedback is processed
            $this->addNodeCreatedFeedback($newlyCreatedNode);
        }
    }
}
