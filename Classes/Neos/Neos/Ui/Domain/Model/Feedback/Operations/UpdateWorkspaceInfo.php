<?php
namespace Neos\Neos\Ui\Domain\Model\Feedback\Operations;

use Neos\Flow\Annotations as Flow;
use Neos\ContentRepository\Domain\Model\NodeInterface;
use Neos\Neos\Ui\Domain\Model\FeedbackInterface;
use Neos\Neos\Ui\TYPO3CR\Service\WorkspaceService;
use Neos\Flow\Mvc\Controller\ControllerContext;

class UpdateWorkspaceInfo implements FeedbackInterface
{
    /**
     * @var NodeInterface
     */
    protected $document;

    /**
     * @Flow\Inject
     * @var WorkspaceService
     */
    protected $workspaceService;

    /**
     * Set the document
     *
     * @param NodeInterface $document
     * @return void
     */
    public function setDocument(NodeInterface $document)
    {
        $this->document = $document;
    }

    /**
     * Get the document
     *
     * @return NodeInterface
     */
    public function getDocument()
    {
        return $this->document;
    }

    /**
     * Get the type identifier
     *
     * @return string
     */
    public function getType()
    {
        return 'Neos.Neos.Ui:UpdateWorkspaceInfo';
    }

    /**
     * Get the description
     *
     * @return string
     */
    public function getDescription()
    {
        return sprintf('New workspace info for "%s" available.', $this->getDocument()->getProperty('title'));
    }

    /**
     * Checks whether this feedback is similar to another
     *
     * @param FeedbackInterface $feedback
     * @return boolean
     */
    public function isSimilarTo(FeedbackInterface $feedback)
    {
        if (!$feedback instanceof UpdateWorkspaceInfo) {
            return false;
        }

        return $this->getDocument()->getContextPath() === $feedback->getDocument()->getContextPath();
    }

    /**
     * Serialize the payload for this feedback
     *
     * @return mixed
     */
    public function serializePayload(ControllerContext $controllerContext)
    {
        return [
            'documentContextPath' => $this->getDocument()->getContextPath(),
            'workspaceName' => $this->getDocument()->getContext()->getWorkspace()->getName(),
            'workspaceInfo' => $this->workspaceService->getPublishableNodeInfo(
                $this->getDocument()->getContext()->getWorkspace()
            )
        ];
    }
}
