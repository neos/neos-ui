<?php
namespace Neos\Neos\Ui\Domain\Model\Feedback\Operations;

use Neos\Neos\Ui\Domain\Model\FeedbackInterface;
use TYPO3\TYPO3CR\Domain\Model\NodeInterface;
use TYPO3\Neos\View\TypoScriptView as FusionView;
use TYPO3\Flow\Mvc\Controller\ControllerContext;

class RenderNode implements FeedbackInterface
{
    /**
     * @var NodeInterface
     */
    protected $node;

    /**
     * @var array
     */
    protected $referenceData;

    /**
     * @var string
     */
    protected $mode;

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
     * Set the referenceData
     *
     * @param string $referenceData
     * @return void
     */
    public function setReferenceData(array $referenceData)
    {
        $this->referenceData = $referenceData;
    }

    /**
     * Get the referenceData
     *
     * @return string
     */
    public function getReferenceData()
    {
        return $this->referenceData;
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
        return 'Neos.Neos.Ui:RenderNode';
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
        if (!$feedback instanceof RenderNode) {
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
            'reference' => $this->getReferenceData(),
            'mode' => $this->getMode(),
            'renderedContent' => $this->renderContent($controllerContext)
        ];
    }

    /**
     * Render the node
     *
     * @return string
     */
    protected function renderContent(ControllerContext $controllerContext)
    {
        $referenceData = $this->getReferenceData();
        $fusionView = new FusionView();
        $fusionView->setControllerContext($controllerContext);

        $fusionView->assign('value', $this->getNode());
        $fusionView->setTypoScriptPath($referenceData['subject']['fusionPath']);

        return $fusionView->render();
    }
}
