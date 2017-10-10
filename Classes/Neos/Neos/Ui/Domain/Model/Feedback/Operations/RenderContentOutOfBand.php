<?php
namespace Neos\Neos\Ui\Domain\Model\Feedback\Operations;

use Neos\Flow\Annotations as Flow;
use Neos\Neos\Ui\Domain\Model\FeedbackInterface;
use Neos\ContentRepository\Domain\Model\NodeInterface;
use Neos\Neos\View\FusionView as FusionView;
use Neos\Flow\Mvc\Controller\ControllerContext;
use Neos\Neos\Ui\Domain\Model\RenderedNodeDomAddress;
use Neos\Fusion\Core\Cache\ContentCache;

class RenderContentOutOfBand implements FeedbackInterface
{
    /**
     * @var NodeInterface
     */
    protected $node;

    /**
     * The node dom address for the parent node of the created node
     *
     * @var RenderedNodeDomAddress
     */
    protected $parentDomAddress;

    /**
     * The node dom address for the referenced sibling node of the created node
     *
     * @var RenderedNodeDomAddress
     */
    protected $siblingDomAddress;

    /**
     * @var string
     */
    protected $mode;

    /**
     * @Flow\Inject
     * @var ContentCache
     */
    protected $contentCache;

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
     * Set the parent node dom address
     *
     * @param RenderedNodeDomAddress $parentDomAddress
     * @return void
     */
    public function setParentDomAddress(RenderedNodeDomAddress $parentDomAddress = null)
    {
        $this->parentDomAddress = $parentDomAddress;
    }

    /**
     * Get the parent node dom address
     *
     * @return RenderedNodeDomAddress
     */
    public function getParentDomAddress()
    {
        return $this->parentDomAddress;
    }

    /**
     * Set the sibling node dom address
     *
     * @param RenderedNodeDomAddress $siblingDomAddress
     * @return void
     */
    public function setSiblingDomAddress(RenderedNodeDomAddress $siblingDomAddress = null)
    {
        $this->siblingDomAddress = $siblingDomAddress;
    }

    /**
     * Get the sibling node dom address
     *
     * @return RenderedNodeDomAddress
     */
    public function getSiblingDomAddress()
    {
        return $this->siblingDomAddress;
    }

    /**
     * Set the insertion mode (before|after|into)
     *
     * @param string $mode
     * @return void
     */
    public function setMode($mode)
    {
        $this->mode = $mode;
    }

    /**
     * Get the insertion mode (before|after|into)
     *
     * @return string
     */
    public function getMode()
    {
        return $this->mode;
    }

    /**
     * Get the type identifier
     *
     * @return string
     */
    public function getType()
    {
        return 'Neos.Neos.Ui:RenderContentOutOfBand';
    }

    /**
     * Get the description
     *
     * @return string
     */
    public function getDescription()
    {
        return sprintf('Rendering of node "%s" required.', $this->getNode()->getPath());
    }

    /**
     * Checks whether this feedback is similar to another
     *
     * @param FeedbackInterface $feedback
     * @return boolean
     */
    public function isSimilarTo(FeedbackInterface $feedback)
    {
        if (!$feedback instanceof RenderContentOutOfBand) {
            return false;
        }

        return (
            $this->getNode()->getContextPath() === $feedback->getNode()->getContextPath() &&
            $this->getReferenceData() == $feedback->getReferenceData()
        );
    }

    /**
     * Serialize the payload for this feedback
     *
     * @return mixed
     */
    public function serializePayload(ControllerContext $controllerContext)
    {
        return [
            'contextPath' => $this->getNode()->getContextPath(),
            'parentDomAddress' => $this->getParentDomAddress(),
            'siblingDomAddress' => $this->getSiblingDomAddress(),
            'mode' => $this->getMode(),
            'renderedContent' => $this->renderContent($controllerContext)
        ];
    }

    /**
     * Render the node
     *
     * @param ControllerContext $controllerContext
     * @return string
     */
    protected function renderContent(ControllerContext $controllerContext)
    {
        $this->contentCache->flushByTag(sprintf('Node_%s', $this->getNode()->getParent()->getIdentifier()));

        $parentDomAddress = $this->getParentDomAddress();

        $fusionView = new FusionView();
        $fusionView->setControllerContext($controllerContext);

        $fusionView->assign('value', $this->getNode()->getParent());
        $fusionView->setFusionPath($parentDomAddress->getFusionPath());

        return $fusionView->render();
    }
}
