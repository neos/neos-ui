<?php

/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

declare(strict_types=1);

namespace Neos\Neos\Ui\Fusion\Helper;

use Neos\ContentRepository\Core\SharedModel\ContentRepository\ContentRepositoryId;
use Neos\Eel\ProtectedContextAwareInterface;
use Neos\Flow\Annotations as Flow;
use Neos\Neos\Domain\Workspace\WorkspaceProvider;
use Neos\Neos\Ui\ContentRepository\Service\WorkspaceService;

/**
 * @internal implementation detail of the Neos Ui to build its initialState.
 *           and used for the workspace-info endpoint.
 */
class WorkspaceHelper implements ProtectedContextAwareInterface
{
    /**
     * @Flow\Inject
     * @var WorkspaceService
     */
    protected $workspaceService;

    /**
     * @Flow\Inject
     * @var WorkspaceProvider
     */
    protected $workspaceProvider;

    /**
     * @return array<string,mixed>
     */
    public function getPersonalWorkspace(ContentRepositoryId $contentRepositoryId): array
    {
        $personalWorkspace = $this->workspaceProvider->providePrimaryPersonalWorkspaceForCurrentUser($contentRepositoryId);

        return [
            'name' => $personalWorkspace->name,
            'publishableNodes' => $this->workspaceService->getPublishableNodeInfo($personalWorkspace->name, $contentRepositoryId),
            'baseWorkspace' => $personalWorkspace->getCurrentBaseWorkspaceName()?->value,
            // TODO: FIX readonly flag!
            //'readOnly' => !$this->domainUserService->currentUserCanPublishToWorkspace($baseWorkspace)
            'readOnly' => false,
            'status' => $personalWorkspace->getCurrentStatus()->value
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
