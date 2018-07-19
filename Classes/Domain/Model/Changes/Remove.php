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

use Neos\ContentRepository\Domain\Context\DimensionSpace\InterDimensionalVariationGraph;
use Neos\ContentRepository\Domain\Context\Node\Command\RemoveNodesFromAggregate;
use Neos\ContentRepository\Domain\Projection\Content\ContentGraphInterface;
use Neos\Flow\Annotations as Flow;
use Neos\ContentRepository\Domain\Context\Node\NodeCommandHandler;
use Neos\Neos\Ui\Domain\Model\AbstractChange;
use Neos\Neos\Ui\Domain\Model\Feedback\Operations\RemoveNode as RemoveNodeFeedback;
use Neos\Neos\Ui\Domain\Model\Feedback\Operations\UpdateNodeInfo;

/**
 * Removes a node
 */
class Remove extends AbstractChange
{

    /**
     * @Flow\Inject
     * @var NodeCommandHandler
     */
    protected $nodeCommandHandler;

    /**
     * @Flow\Inject
     * @var ContentGraphInterface
     */
    protected $contentGraph;

    /**
     * @Flow\Inject
     * @var InterDimensionalVariationGraph
     */
    protected $interDimensionalVariationGraph;

    /**
     * Checks whether this change can be applied to the subject
     *
     * @return boolean
     */
    public function canApply()
    {
        return true;
    }

    /**
     * Applies this change
     *
     * @return void
     */
    public function apply()
    {
        if ($this->canApply()) {
            $node = $this->getSubject();

            // NOTE: we always delete this dimension AND ALL SPECIALIZATIONS currently.
            // this is a slight deviation from the old, non-event-sourced, behavior; but I believe it is
            // more consistent this way. At some point, the user might want to see a dialog where he can chose
            // what to remove specifically; e.g. whether to trigger RemoveNodeAggregate completely; or whether
            // to use RemoveNodesFromAggregate with a specific DimensionSpacePointSet.
            $nodeDimensionsAndSpecializations = $this->interDimensionalVariationGraph->getSpecializationSet($node->getDimensionSpacePoint());
            $command = new RemoveNodesFromAggregate(
                $node->getContentStreamIdentifier(),
                $node->getNodeAggregateIdentifier(),
                $nodeDimensionsAndSpecializations
            );

            // WORKAROUND: the following feedbacks still need a reference to the node, so we need to
            // queue them before deleting the node.
            $this->updateWorkspaceInfo();

            $updateParentNodeInfo = new UpdateNodeInfo();
            $subgraph = $this->contentGraph->getSubgraphByIdentifier($node->getContentStreamIdentifier(), $node->getDimensionSpacePoint());
            $parentNode = $subgraph->findParentNode($node->getNodeIdentifier());
            $updateParentNodeInfo->setNode($parentNode);

            $this->feedbackCollection->add($updateParentNodeInfo);

            $removeNode = new RemoveNodeFeedback();
            $removeNode->setNode($node);

            $this->feedbackCollection->add($removeNode);

            // do the actual removal
            $this->nodeCommandHandler->handleRemoveNodesFromAggregate($command);
        }
    }
}
