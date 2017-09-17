<?php
namespace Neos\Neos\Ui\Fusion\Helper;

use Neos\Flow\Annotations as Flow;
use Neos\Eel\ProtectedContextAwareInterface;
use Neos\ContentRepository\Domain\Model\Workspace;
use Neos\Neos\Service\UserService;
use Neos\Neos\Ui\ContentRepository\Service\WorkspaceService;

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

    /**
     * @param Workspace $workspace
     * @return array
     */
    public function getPublishableNodeInfo(Workspace $workspace)
    {
        return $this->workspaceService->getPublishableNodeInfo($workspace);
    }

    public function getPersonalWorkspace()
    {
        $personalWorkspace = $this->userService->getPersonalWorkspace();
        return [
            'name' => $personalWorkspace->getName(),
            'publishableNodes' => $this->getPublishableNodeInfo($personalWorkspace),
            'baseWorkspace' => $personalWorkspace->getBaseWorkspace()->getName()
        ];
    }

    public function getAllowedTargetWorkspaces()
    {
        return $this->workspaceService->getAllowedTargetWorkspaces();
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
