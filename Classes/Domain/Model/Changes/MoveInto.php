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

use Neos\ContentRepository\Core\Feature\NodeMove\Command\MoveNodeAggregate;
use Neos\ContentRepository\Core\Projection\ContentGraph\Node;
use Neos\ContentRepository\Core\Feature\NodeMove\Dto\RelationDistributionStrategy;
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
            $this->parentContextPath,
            $this->getSubject()->subgraphIdentity->contentRepositoryId
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
                ->findParentNode($subject->nodeAggregateId);

            $hasEqualParentNode = $otherParent && $otherParent->nodeAggregateId
                    ->equals($parentNode->nodeAggregateId);

            $contentRepository = $this->contentRepositoryRegistry->get($subject->subgraphIdentity->contentRepositoryId);
            $workspace = $this->contentRepositoryRegistry->get($this->subject->subgraphIdentity->contentRepositoryId)
                ->getWorkspaceFinder()->findOneByCurrentContentStreamId($subject->subgraphIdentity->contentStreamId);
            if (!$workspace) {
                throw new \Exception(
                    'Could not find workspace for content stream "' . $subject->subgraphIdentity->contentStreamId->value . '"',
                    1699008140
                );
            }
            $contentRepository->handle(
                MoveNodeAggregate::create(
                    $workspace->workspaceName,
                    $subject->subgraphIdentity->dimensionSpacePoint,
                    $subject->nodeAggregateId,
                    null,
                    $hasEqualParentNode ? null : $parentNode->nodeAggregateId,
                )
            )->block();

            $updateParentNodeInfo = new UpdateNodeInfo();
            $updateParentNodeInfo->setNode($parentNode);
            $this->feedbackCollection->add($updateParentNodeInfo);

            $this->finish($subject);
        }
    }
}
