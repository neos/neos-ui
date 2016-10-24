<?php
namespace Neos\Neos\Ui\Domain\Model;

use Neos\Neos\Ui\Domain\Model\Feedback\Operations\ReloadDocument;
use TYPO3\Flow\Annotations as Flow;
use TYPO3\TYPO3CR\Domain\Model\NodeInterface;
use Neos\Neos\Ui\TYPO3CR\Service\NodeService;
use Neos\Neos\Ui\Domain\Model\Feedback\Operations\UpdateWorkspaceInfo;

abstract class AbstractChange implements ChangeInterface
{
    /**
     * @var NodeInterface
     */
    protected $subject;

    /**
     * @Flow\Inject
     * @var FeedbackCollection
     */
    protected $feedbackCollection;

    /**
     * Set the subject
     *
     * @param NodeInterface $subject
     * @return void
     */
    public function setSubject(NodeInterface $subject)
    {
        $this->subject = $subject;
    }

    /**
     * Get the subject
     *
     * @return NodeInterface
     */
    public function getSubject()
    {
        return $this->subject;
    }

    /**
     * Helper method to inform the client, that new workspace information is available
     *
     * @return void
     */
    protected function updateWorkspaceInfo()
    {
        $nodeService = new NodeService();
        $updateWorkspaceInfo = new UpdateWorkspaceInfo();
        $updateWorkspaceInfo->setDocument(
            $nodeService->getClosestDocument($this->getSubject())
        );

        $this->feedbackCollection->add($updateWorkspaceInfo);
    }

    /**
     * Inform the client to reload the currently-displayed document, because the rendering has changed.
     *
     * This method will be triggered if [nodeType].properties.[propertyName].ui.reloadIfChanged is TRUE.
     *
     * @return void
     */
    protected function reloadDocument()
    {
        $nodeService = new NodeService();
        $reloadDocument = new ReloadDocument();
        $reloadDocument->setDocument(
            $nodeService->getClosestDocument($this->getSubject())
        );

        $this->feedbackCollection->add($reloadDocument);
    }
}
