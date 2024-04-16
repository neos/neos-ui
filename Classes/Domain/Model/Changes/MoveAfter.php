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

use InvalidArgumentException;
use Neos\ContentRepository\Core\Feature\NodeMove\Command\MoveNodeAggregate;
use Neos\ContentRepository\Core\Feature\NodeMove\Dto\RelationDistributionStrategy;
use Neos\Neos\Ui\Domain\Model\Feedback\Operations\RemoveNode;
use Neos\Neos\Ui\Domain\Model\Feedback\Operations\UpdateNodeInfo;

/**
 * @internal These objects internally reflect possible operations made by the Neos.Ui.
 *           They are sorely an implementation detail. You should not use them!
 *           Please look into the php command API of the Neos CR instead.
 */
class MoveAfter extends AbstractStructuralChange
{
    /**
     * "Subject" is the to-be-moved node; the "sibling" node is the node after which the "Subject" should be copied.
     */
    public function canApply(): bool
    {
        if (is_null($this->subject)) {
            return false;
        }
        $sibling = $this->getSiblingNode();
        if (is_null($sibling)) {
            return false;
        }
        $parent = $this->findParentNode($sibling);
        $nodeType = $this->subject->nodeType;

        return !is_null($parent) && $this->isNodeTypeAllowedAsChildNode($parent, $nodeType);
    }

    public function getMode(): string
    {
        return 'after';
    }

    /**
     * Applies this change
     *
     * @return void
     */
    public function apply(): void
    {
        $precedingSibling = $this->getSiblingNode();
        $parentNodeOfPreviousSibling = $precedingSibling ? $this->findParentNode($precedingSibling) : null;
        // "subject" is the to-be-moved node
        $subject = $this->subject;
        $parentNode = $this->subject ? $this->findParentNode($this->subject) : null;
        if ($this->canApply()
            && !is_null($subject)
            && !is_null($precedingSibling)
            && !is_null($parentNodeOfPreviousSibling)
            && !is_null($parentNode)
        ) {
            $succeedingSibling = null;
            try {
                $succeedingSibling = $this->findChildNodes($parentNodeOfPreviousSibling)->next($precedingSibling);
            } catch (InvalidArgumentException $e) {
                // do nothing; $succeedingSibling is null.
            }

            $hasEqualParentNode = $parentNode->nodeAggregateId
                ->equals($parentNodeOfPreviousSibling->nodeAggregateId);


            $contentRepository = $this->contentRepositoryRegistry->get($subject->subgraphIdentity->contentRepositoryId);
            $workspace = $this->contentRepositoryRegistry->get($this->subject->subgraphIdentity->contentRepositoryId)
                ->getWorkspaceFinder()->findOneByCurrentContentStreamId($subject->subgraphIdentity->contentStreamId);
            if (!$workspace) {
                throw new \Exception(
                    'Could not find workspace for content stream "' . $subject->subgraphIdentity->contentStreamId->value . '"',
                    1699008140
                );
            }

            $command = MoveNodeAggregate::create(
                $workspace->workspaceName,
                $subject->subgraphIdentity->dimensionSpacePoint,
                $subject->nodeAggregateId,
                null,
                $hasEqualParentNode ? null : $parentNodeOfPreviousSibling->nodeAggregateId,
                $precedingSibling->nodeAggregateId,
                $succeedingSibling?->nodeAggregateId,
            );
            $contentRepository->handle($command)->block();

            $updateParentNodeInfo = new UpdateNodeInfo();
            $updateParentNodeInfo->setNode($parentNodeOfPreviousSibling);
            $this->feedbackCollection->add($updateParentNodeInfo);

            $this->finish($subject);
        }
    }
}
