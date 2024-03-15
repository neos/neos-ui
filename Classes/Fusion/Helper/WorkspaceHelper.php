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
        $readOnly = !$this->domainUserService->currentUserCanPublishToWorkspace($baseWorkspace);

        if ($readOnly === true && $this->workspaceService->shouldHideReadOnlyWorkspaces()) {
            // Skip read only workspaces
            $baseWorkspace = $this->getFirstWriteableTargetWorkspace();
            $this->workspaceService->setBaseWorkspace($baseWorkspace);
            $readOnly = !$this->domainUserService->currentUserCanPublishToWorkspace($baseWorkspace);
        }

        return [
            'name' => $personalWorkspace->getName(),
            'publishableNodes' => $this->getPublishableNodeInfo($personalWorkspace),
            'baseWorkspace' => $baseWorkspace->getName(),
            'readOnly' => $readOnly
        ];
    }

    /**
     * Returns the first writable workspace for the current user. If we find no writeable workspace
     * we use the configured targetWorkspace as fallback. This is mostly live.
     *
     * @return Workspace|null
     */
    public function getFirstWriteableTargetWorkspace(): ?Workspace
    {
        $allowedTargetWorkspaces = $this->getAllowedTargetWorkspaces();
        foreach ($allowedTargetWorkspaces as $allowedTargetWorkspace) {
            $readOnly = $allowedTargetWorkspace['readonly'];
            if ($readOnly === true) {
                continue;
            }

            $writeableTargetWorkspace = $this->workspaceService->getWorkspaceByName($allowedTargetWorkspace['name']);
            if ($writeableTargetWorkspace) {
                return $writeableTargetWorkspace;
            }
        }

        // Live as fallback
        return $this->workspaceService->getWorkspaceByName($this->workspaceService->getInitialUserTargetWorkspace());
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
