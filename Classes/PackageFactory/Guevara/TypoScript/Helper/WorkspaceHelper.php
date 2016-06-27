<?php
namespace Neos\Neos\Ui\TypoScript\Helper;

use TYPO3\Flow\Annotations as Flow;
use TYPO3\Eel\ProtectedContextAwareInterface;
use TYPO3\TYPO3CR\Domain\Model\Workspace;
use TYPO3\Neos\Service\UserService;
use Neos\Neos\Ui\TYPO3CR\Service\WorkspaceService;

class WorkspaceHelper implements ProtectedContextAwareInterface
{
    /**
     * @Flow\Inject
     * @var WorkspaceService
     */
    protected $workspaceService;

    /**
     * @Flow\Inject
     * @var UserService
     */
    protected $userService;

    public function getPublishableNodeInfo(Workspace $workspace)
    {
        return $this->workspaceService->getPublishableNodeInfo($workspace);
    }


    public function getPersonalWorkspaceName()
    {
        return $this->userService->getPersonalWorkspace()->getName();
    }

    public function initializeWorkspacesByName()
    {
        $workspaces = [];

        $personalWorkspace = $this->userService->getPersonalWorkspace();

        $workspaces[$personalWorkspace->getName()] = [
            'name' => $personalWorkspace->getName(),
            'publishableNodes' => $this->getPublishableNodeInfo($personalWorkspace)
        ];

        return $workspaces;
    }

    /**
     * @param string $methodName
     * @return boolean
     */
    public function allowsCallOfMethod($methodName)
    {
        return true;
    }
}
