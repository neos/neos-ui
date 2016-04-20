<?php
namespace PackageFactory\Guevara\Domain\Model;

use TYPO3\Flow\Annotations as Flow;
use TYPO3\TYPO3CR\Domain\Model\NodeInterface;
use PackageFactory\Guevara\TYPO3CR\Service\NodeService;
use PackageFactory\Guevara\Domain\Model\Feedback\Operations\UpdateWorkspaceInfo;

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
}
