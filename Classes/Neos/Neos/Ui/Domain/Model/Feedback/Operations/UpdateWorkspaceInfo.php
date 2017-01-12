<?php
namespace Neos\Neos\Ui\Domain\Model\Feedback\Operations;

use Neos\Flow\Annotations as Flow;
use Neos\ContentRepository\Domain\Model\Workspace;
use Neos\Neos\Ui\Domain\Model\FeedbackInterface;
use Neos\Neos\Ui\TYPO3CR\Service\WorkspaceService;
use Neos\Flow\Mvc\Controller\ControllerContext;

class UpdateWorkspaceInfo implements FeedbackInterface
{
    /**
     * @var Workspace
     */
    protected $workspace;

    /**
     * @Flow\Inject
     * @var WorkspaceService
     */
    protected $workspaceService;

    /**
     * Set the workspace
     *
     * @param Workspace $workspace
     * @return void
     */
    public function setWorkspace(Workspace $workspace)
    {
        $this->workspace = $workspace;
    }

    /**
     * Get the document
     *
     * @return Workspace
     */
    public function getWorkspace()
    {
        return $this->workspace;
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
        return sprintf('New workspace info available.');
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

        return $this->getWorkspace() === $feedback->getWorkspace();
    }

    /**
     * Serialize the payload for this feedback
     *
     * @return mixed
     */
    public function serializePayload(ControllerContext $controllerContext)
    {
        return [
            'name' => $this->getWorkspace()->getName(),
            'publishableNodes' => $this->workspaceService->getPublishableNodeInfo(
                $this->getWorkspace()
            ),
            'baseWorkspace' => $this->getWorkspace()->getBaseWorkspace()->getName()
        ];
    }
}
