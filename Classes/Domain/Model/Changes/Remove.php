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

use Neos\ContentRepository\Core\DimensionSpace\Exception\DimensionSpacePointNotFound;
use Neos\ContentRepository\Core\Feature\Common\Exception\ContentStreamDoesNotExistYet;
use Neos\ContentRepository\Core\Feature\Common\NodeVariantSelectionStrategy;
use Neos\ContentRepository\Core\Feature\NodeRemoval\Command\RemoveNodeAggregate;
use Neos\ContentRepository\Core\Feature\Common\Exception\NodeAggregatesTypeIsAmbiguous;
use Neos\Flow\Annotations as Flow;
use Neos\Neos\Fusion\Cache\ContentCacheFlusher;
use Neos\Neos\Ui\Domain\Model\AbstractChange;
use Neos\Neos\Ui\Domain\Model\Feedback\Operations\RemoveNode;
use Neos\Neos\Ui\Domain\Model\Feedback\Operations\UpdateNodeInfo;

/**
 * Removes a node
 */
class Remove extends AbstractChange
{
    /**
     * @Flow\Inject
     * @var ContentCacheFlusher
     */
    protected $contentCacheFlusher;

    /**
     * Checks whether this change can be applied to the subject
     *
     * @return boolean
     */
    public function canApply(): bool
    {
        return !is_null($this->subject);
    }

    /**
     * Applies this change
     *
     * @throws NodeAggregatesTypeIsAmbiguous
     * @throws ContentStreamDoesNotExistYet
     * @throws DimensionSpacePointNotFound
     * @throws \Neos\ContentRepository\Exception\NodeException
     */
    public function apply(): void
    {
        $subject = $this->subject;
        if ($this->canApply() && !is_null($subject)) {
            $parentNode = $this->findParentNode($subject);
            if (is_null($parentNode)) {
                throw new \InvalidArgumentException(
                    'Cannot apply Remove without a parent on node ' . $subject->nodeAggregateIdentifier,
                    1645560717
                );
            }

            // we have to schedule an the update workspace info before we actually delete the node;
            // otherwise we cannot find the parent nodes anymore.
            $this->updateWorkspaceInfo();

            $closestDocumentParentNode = $this->findClosestDocumentNode($subject);
            $command = new RemoveNodeAggregate(
                $subject->subgraphIdentity->contentStreamIdentifier,
                $subject->nodeAggregateIdentifier,
                $subject->subgraphIdentity->dimensionSpacePoint,
                NodeVariantSelectionStrategy::STRATEGY_ALL_SPECIALIZATIONS,
                $this->getInitiatingUserIdentifier(),
                $closestDocumentParentNode?->nodeAggregateIdentifier
            );

            $contentRepository = $this->contentRepositoryRegistry->get($subject->subgraphIdentity->contentRepositoryIdentifier);
            $contentRepository->handle($command)->block();

            $removeNode = new RemoveNode($subject, $parentNode);
            $this->feedbackCollection->add($removeNode);

            $updateParentNodeInfo = new UpdateNodeInfo();
            $updateParentNodeInfo->setNode($parentNode);

            $this->feedbackCollection->add($updateParentNodeInfo);
        }
    }
}
