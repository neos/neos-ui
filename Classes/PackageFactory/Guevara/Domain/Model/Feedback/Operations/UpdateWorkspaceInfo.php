<?php
namespace PackageFactory\Guevara\Domain\Model\Feedback\Operations;

use TYPO3\Flow\Annotations as Flow;
use TYPO3\TYPO3CR\Domain\Model\NodeInterface;
use PackageFactory\Guevara\Domain\Model\FeedbackInterface;
use PackageFactory\Guevara\TYPO3CR\Service\WorkspaceService;

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
        return 'PackageFactory.Guevara:UpdateWorkspaceInfo';
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
    public function serializePayload()
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
