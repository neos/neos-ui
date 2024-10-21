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
use Neos\Neos\Domain\Service\WorkspaceService;
use Neos\Neos\Security\Authorization\ContentRepositoryAuthorizationService;
use Neos\Neos\Ui\ContentRepository\Service\WorkspaceService as UiWorkspaceService;

/**
 * @internal implementation detail of the Neos Ui to build its initialState {@see \Neos\Neos\Ui\Infrastructure\Configuration\InitialStateProvider}
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
     * @var Context
     */
    protected $securityContext;

    /**
     * @Flow\Inject
     * @var UiWorkspaceService
     */
    protected $uiWorkspaceService;

    /**
     * @Flow\Inject
     * @var UserService
     */
    protected $userService;

    /**
     * @Flow\Inject
     * @var WorkspaceService
     */
    protected $workspaceService;

    /**
     * @Flow\Inject
     * @var ContentRepositoryAuthorizationService
     */
    protected $contentRepositoryAuthorizationService;

    /**
     * @return array<string,mixed>
     */
    public function getPersonalWorkspace(ContentRepositoryId $contentRepositoryId): array
    {
        $currentUser = $this->userService->getCurrentUser();
        if ($currentUser === null) {
            return [];
        }
        $contentRepository = $this->contentRepositoryRegistry->get($contentRepositoryId);
        $personalWorkspace = $this->workspaceService->getPersonalWorkspaceForUser($contentRepositoryId, $currentUser->getId());
        $personalWorkspacePermissions = $this->contentRepositoryAuthorizationService->getWorkspacePermissionsForUser($contentRepositoryId, $personalWorkspace->workspaceName, $currentUser);
        $publishableNodes = $this->uiWorkspaceService->getPublishableNodeInfo($personalWorkspace->workspaceName, $contentRepository->id);
        return [
            'name' => $personalWorkspace->workspaceName->value,
            'totalNumberOfChanges' => count($publishableNodes),
            'publishableNodes' => $publishableNodes,
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
