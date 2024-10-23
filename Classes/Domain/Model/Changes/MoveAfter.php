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
        $sibling = $this->getSiblingNode();
        if (is_null($sibling)) {
            return false;
        }
        $parent = $this->findParentNode($sibling);

        return $parent && $this->isNodeTypeAllowedAsChildNode($parent, $this->subject->nodeTypeName);
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
        $parentNode = $this->findParentNode($this->subject);
        if ($this->canApply()
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

            $hasEqualParentNode = $parentNode->aggregateId
                ->equals($parentNodeOfPreviousSibling->aggregateId);


            $contentRepository = $this->contentRepositoryRegistry->get($subject->contentRepositoryId);

            $command = MoveNodeAggregate::create(
                $subject->workspaceName,
                $subject->dimensionSpacePoint,
                $subject->aggregateId,
                null,
                $hasEqualParentNode ? null : $parentNodeOfPreviousSibling->aggregateId,
                $precedingSibling->aggregateId,
                $succeedingSibling?->aggregateId,
            );
            $contentRepository->handle($command);

            $updateParentNodeInfo = new UpdateNodeInfo();
            $updateParentNodeInfo->setNode($parentNodeOfPreviousSibling);
            $this->feedbackCollection->add($updateParentNodeInfo);

            $this->finish($subject);
        }
    }
}
