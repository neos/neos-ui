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

use Neos\ContentRepository\Feature\NodeMove\Command\MoveNodeAggregate;
use Neos\ContentRepository\Projection\ContentGraph\Node;
use Neos\ContentRepository\Projection\ContentGraph\NodeInterface;
use Neos\ContentRepository\Feature\NodeMove\Command\RelationDistributionStrategy;
use Neos\Neos\Ui\Domain\Model\Feedback\Operations\RemoveNode;
use Neos\Neos\Ui\Domain\Model\Feedback\Operations\UpdateNodeInfo;

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

        return $this->nodeService->getNodeFromContextPath(
            $this->parentContextPath,
            $this->getSubject()->getSubgraphIdentity()->contentRepositoryIdentifier
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
        if (is_null($this->subject)) {
            return false;
        }
        $parent = $this->getParentNode();
        $nodeType = $this->subject->nodeType;

        return $parent && $this->isNodeTypeAllowedAsChildNode($parent, $nodeType);
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
        if ($this->canApply() && $parentNode && $subject) {
            $otherParent = $this->contentRepositoryRegistry->subgraphForNode($subject)
                ->findParentNode($subject->nodeAggregateIdentifier);

            $hasEqualParentNode = $otherParent && $otherParent->nodeAggregateIdentifier
                    ->equals($parentNode->nodeAggregateIdentifier);

            $contentRepository = $this->contentRepositoryRegistry->get($subject->subgraphIdentity->contentRepositoryIdentifier);
            $contentRepository->handle(
                new MoveNodeAggregate(
                    $subject->subgraphIdentity->contentStreamIdentifier,
                    $subject->subgraphIdentity->dimensionSpacePoint,
                    $subject->nodeAggregateIdentifier,
                    $hasEqualParentNode ? null : $parentNode->nodeAggregateIdentifier,
                    null,
                    null,
                    RelationDistributionStrategy::STRATEGY_GATHER_ALL,
                    $this->getInitiatingUserIdentifier()
                )
            )->block();

            $updateParentNodeInfo = new UpdateNodeInfo();
            $updateParentNodeInfo->setNode($parentNode);
            $this->feedbackCollection->add($updateParentNodeInfo);

            $removeNode = new RemoveNode($subject, $parentNode);
            $this->feedbackCollection->add($removeNode);

            $this->finish($subject);
        }
    }
}
