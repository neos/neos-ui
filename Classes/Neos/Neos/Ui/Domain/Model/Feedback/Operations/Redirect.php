<?php
namespace Neos\Neos\Ui\Domain\Model\Feedback\Operations;

use Neos\Flow\Annotations as Flow;
use Neos\Neos\Service\LinkingService;
use Neos\Neos\Ui\Fusion\Helper\NodeInfoHelper;
use Neos\Neos\Ui\Domain\Model\FeedbackInterface;
use Neos\ContentRepository\Domain\Model\NodeInterface;
use Neos\Flow\Mvc\Controller\ControllerContext;

class Redirect implements FeedbackInterface
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
     * @Flow\Inject
     * @var LinkingService
     */
    protected $linkingService;

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
    public function getNode(): NodeInterface
    {
        return $this->node;
    }

    /**
     * Get the type identifier
     *
     * @return string
     */
    public function getType(): string
    {
        return 'Neos.Neos.Ui:Redirect';
    }

    /**
     * Get the description
     *
     * @return string
     */
    public function getDescription(): string
    {
        return sprintf('Redirect to node "%s".', $this->getNode()->getContextPath());
    }

    /**
     * Checks whether this feedback is similar to another
     *
     * @param FeedbackInterface $feedback
     * @return boolean
     */
    public function isSimilarTo(FeedbackInterface $feedback): boolean
    {
        if (!$feedback instanceof UpdateNodeInfo) {
            return false;
        }

        return $this->getNode()->getContextPath() === $feedback->getNode()->getContextPath();
    }

    /**
     * Serialize the payload for this feedback
     *
     * @param ControllerContext $controllerContext
     * @return array
     */
    public function serializePayload(ControllerContext $controllerContext): array
    {
        $node = $this->getNode();
        $redirectUri = $this->linkingService->createNodeUri($controllerContext, $node, null, null, true, array(), '', false, array(), false);
        return [
            'redirectUri' => $redirectUri,
            'redirectContextPath' => $node->getContextPath()
        ];
    }
}
