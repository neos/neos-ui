<?php
namespace Neos\Neos\Ui\Domain\Model\Feedback\Operations;

/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

use Neos\ContentRepository\Core\Projection\ContentGraph\Node;
use Neos\ContentRepository\Core\SharedModel\Node\NodeAddress;
use Neos\ContentRepositoryRegistry\ContentRepositoryRegistry;
use Neos\Flow\Annotations as Flow;
use Neos\Flow\Mvc\Controller\ControllerContext;
use Neos\Neos\Domain\NodeLabel\NodeLabelGeneratorInterface;
use Neos\Neos\Ui\Domain\Model\AbstractFeedback;
use Neos\Neos\Ui\Domain\Model\FeedbackInterface;

/**
 * @internal
 */
class RemoveNode extends AbstractFeedback
{
    protected Node $node;

    protected Node $parentNode;

    private NodeAddress $nodeAddress;

    private NodeAddress $parentNodeAddress;

    /**
     * @Flow\Inject
     * @var NodeLabelGeneratorInterface
     */
    protected $nodeLabelGenerator;

    /**
     * @Flow\Inject
     * @var ContentRepositoryRegistry
     */
    protected $contentRepositoryRegistry;

    public function __construct(Node $node, Node $parentNode)
    {
        $this->node = $node;
        $this->parentNode = $parentNode;
    }

    protected function initializeObject(): void
    {
        $this->nodeAddress = NodeAddress::fromNode($this->node);
        $this->parentNodeAddress = NodeAddress::fromNode($this->parentNode);
    }

    public function getNode(): Node
    {
        return $this->node;
    }

    /**
     * Get the type identifier
     *
     * @return string
     */
    public function getType()
    {
        return 'Neos.Neos.Ui:RemoveNode';
    }

    /**
     * Get the description
     *
     * @return string
     */
    public function getDescription(): string
    {
        return sprintf('Node "%s" has been removed.', $this->nodeLabelGenerator->getLabel($this->getNode()));
    }

    /**
     * Checks whether this feedback is similar to another
     *
     * @param FeedbackInterface $feedback
     * @return boolean
     */
    public function isSimilarTo(FeedbackInterface $feedback)
    {
        if (!$feedback instanceof RemoveNode) {
            return false;
        }

        return $this->getNode()->equals($feedback->getNode());
    }

    /**
     * Serialize the payload for this feedback
     *
     * @param ControllerContext $controllerContext
     * @return mixed
     */
    public function serializePayload(ControllerContext $controllerContext)
    {
        return [
            'contextPath' => $this->nodeAddress->toJson(),
            'parentContextPath' => $this->parentNodeAddress->toJson()
        ];
    }
}
