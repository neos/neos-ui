<?php
namespace Neos\Neos\Ui\Domain\Model\Feedback\Operations;

use Neos\Flow\Annotations as Flow;
use Neos\Neos\Ui\TypoScript\Helper\NodeInfoHelper;
use Neos\Neos\Ui\Domain\Model\FeedbackInterface;
use Neos\ContentRepository\Domain\Model\NodeInterface;
use Neos\Flow\Mvc\Controller\ControllerContext;

class UpdateNodeInfo implements FeedbackInterface
{
    /**
     * @var NodeInterface
     */
    protected $node;

    /**
     * @Flow\Inject
     * @var NodeInfoHelper
     */
    protected $nodeInfoHelper;

    /**
     * Set the node
     *
     * @param NodeInterface $node
     * @return void
     */
    public function setNode(NodeInterface $node)
    {
        $this->node = $node;
    }

    /**
     * Get the node
     *
     * @return NodeInterface
     */
    public function getNode()
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
        return 'Neos.Neos.Ui:UpdateNodeInfo';
    }

    /**
     * Get the description
     *
     * @return string
     */
    public function getDescription()
    {
        return sprintf('Updated info for node "%s" is available.', $this->getNode()->getContextPath());
    }

    /**
     * Checks whether this feedback is similar to another
     *
     * @param FeedbackInterface $feedback
     * @return boolean
     */
    public function isSimilarTo(FeedbackInterface $feedback)
    {
        if (!$feedback instanceof UpdateNodeInfo) {
            return false;
        }

        return $this->getNode()->getContextPath() === $feedback->getNode()->getContextPath();
    }

    /**
     * Serialize the payload for this feedback
     *
     * @return mixed
     */
    public function serializePayload(ControllerContext $controllerContext)
    {
        return [
            'byContextPath' => $this->serializeNodeRecursively($this->getNode(), $controllerContext)
        ];
    }

    /**
     * Serialize node and all child nodes
     *
     * @param NodeInterface $node
     * @param array $list
     * @return array
     */
    public function serializeNodeRecursively(NodeInterface $node, ControllerContext $controllerContext)
    {
        $result = [
            $node->getContextPath() => $this->nodeInfoHelper->renderNode($node, $controllerContext)
        ];

        foreach ($node->getChildNodes() as $childNode) {
            $result = array_merge($result, $this->serializeNodeRecursively($childNode, $controllerContext));
        }

        return $result;
    }
}
