<?php
namespace Neos\Neos\Ui\Fusion\Helper;

/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

use Neos\ContentRepository\Domain\Model\Workspace;
use Neos\Eel\ProtectedContextAwareInterface;
use Neos\Flow\Annotations as Flow;
use Neos\Neos\Domain\Service\UserService as DomainUserService;
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
     * @var DomainUserService
     */
    protected $domainUserService;

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
        $baseWorkspace = $personalWorkspace->getBaseWorkspace();

        return [
            'name' => $personalWorkspace->getName(),
            'publishableNodes' => $this->getPublishableNodeInfo($personalWorkspace),
            'baseWorkspace' => $baseWorkspace->getName(),
            'readOnly' => !$this->domainUserService->currentUserCanPublishToWorkspace($baseWorkspace)
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
