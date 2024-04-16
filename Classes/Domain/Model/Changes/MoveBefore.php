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
use Neos\ContentRepository\Core\Feature\NodeMove\Dto\RelationDistributionStrategy;
use Neos\Neos\Ui\Domain\Model\Feedback\Operations\RemoveNode;
use Neos\Neos\Ui\Domain\Model\Feedback\Operations\UpdateNodeInfo;

/**
 * @internal These objects internally reflect possible operations made by the Neos.Ui.
 *           They are sorely an implementation detail. You should not use them!
 *           Please look into the php command API of the Neos CR instead.
 */
class MoveBefore extends AbstractStructuralChange
{
    /**
     * "Subject" is the to-be-moved node; the "sibling" node is the node after which the "Subject" should be copied.
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
        $parent = $this->findParentNode($siblingNode);
        $nodeType = $this->subject->nodeType;

        return $parent && $this->isNodeTypeAllowedAsChildNode($parent, $nodeType);
    }

    public function getMode(): string
    {
        return 'before';
    }

    /**
     * Applies this change
     */
    public function apply(): void
    {
        $succeedingSibling = $this->getSiblingNode();
        // "subject" is the to-be-moved node
        $subject = $this->subject;
        $parentNode = $subject ? $this->findParentNode($subject) : null;
        $succeedingSiblingParent = $succeedingSibling ? $this->findParentNode($succeedingSibling) : null;
        if ($this->canApply() && !is_null($subject) && !is_null($succeedingSibling)
            && !is_null($parentNode) && !is_null($succeedingSiblingParent)
        ) {
            $precedingSibling = null;
            try {
                $precedingSibling = $this->findChildNodes($parentNode)
                    ->previous($succeedingSibling);
            } catch (\InvalidArgumentException $e) {
                // do nothing; $precedingSibling is null.
            }

            $hasEqualParentNode = $parentNode->nodeAggregateId
                ->equals($succeedingSiblingParent->nodeAggregateId);

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
                    $hasEqualParentNode
                        ? null
                        : $succeedingSiblingParent->nodeAggregateId,
                    $precedingSibling?->nodeAggregateId,
                    $succeedingSibling->nodeAggregateId,
                )
            )->block();

            $updateParentNodeInfo = new UpdateNodeInfo();
            $updateParentNodeInfo->setNode($succeedingSiblingParent);

            $this->feedbackCollection->add($updateParentNodeInfo);

            $this->finish($subject);
        }
    }
}
