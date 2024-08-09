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

use Neos\ContentRepository\Core\SharedModel\ContentRepository\ContentRepositoryId;
use Neos\ContentRepositoryRegistry\ContentRepositoryRegistry;
use Neos\Eel\ProtectedContextAwareInterface;
use Neos\Flow\Annotations as Flow;
use Neos\Flow\Security\Context;
use Neos\Neos\Domain\Service\UserService;
use Neos\Neos\Domain\Service\WorkspacePublishingService;
use Neos\Neos\Domain\Service\WorkspaceService as NeosWorkspaceService;
use Neos\Neos\Ui\ContentRepository\Service\WorkspaceService;

/**
 * @internal implementation detail of the Neos Ui to build its initialState.
 *           and used for the workspace-info endpoint.
 *
 * TODO REMOVE
 */
class WorkspaceHelper implements ProtectedContextAwareInterface
{
    /**
     * @Flow\Inject
     * @var ContentRepositoryRegistry
     */
    protected $contentRepositoryRegistry;

    /**
     * @Flow\Inject
     * @var WorkspaceService
     */
    protected $workspaceService;

    /**
     * @Flow\Inject
     * @var Context
     */
    protected $securityContext;

    /**
     * @Flow\Inject
     * @var WorkspacePublishingService
     */
    protected $workspacePublishingService;

    /**
     * @Flow\Inject
     * @var UserService
     */
    protected $userService;

    /**
     * @Flow\Inject
     * @var NeosWorkspaceService
     */
    protected $neosWorkspaceService;

    /**
     * @return array<string,mixed>
     */
    public function getPersonalWorkspace(ContentRepositoryId $contentRepositoryId): array
    {
        $currentUser = $this->userService->getCurrentUser();
        if ($currentUser === null) {
            return [];
        }
        $personalWorkspace = $this->neosWorkspaceService->getPersonalWorkspaceForUser($contentRepositoryId, $currentUser->getId());
        $personalWorkspacePermissions = $this->neosWorkspaceService->getWorkspacePermissionsForUser($contentRepositoryId, $personalWorkspace->workspaceName, $currentUser);
        return [
            'name' => $personalWorkspace->workspaceName->value,
            'totalNumberOfChanges' => $this->workspacePublishingService->countPendingWorkspaceChanges($contentRepositoryId, $personalWorkspace->workspaceName),
            'publishableNodes' => $this->workspaceService->getPublishableNodeInfo($personalWorkspace->workspaceName, $contentRepositoryId),
            'baseWorkspace' => $personalWorkspace->baseWorkspaceName?->value,
            'readOnly' => !($personalWorkspace->baseWorkspaceName !== null && $personalWorkspacePermissions->write),
            'status' => $personalWorkspace->status->value,
        ];
    }

    /**
     * @param string $methodName
     * @return bool
     */
    public function allowsCallOfMethod($methodName)
    {
        return true;
    }
}
