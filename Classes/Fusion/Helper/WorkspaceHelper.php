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
use Neos\Neos\Domain\Service\WorkspaceNameBuilder;
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
     * @var WorkspaceProvider
     */
    protected $workspaceProvider;

    /**
     * @return array<string,mixed>
     */
    public function getPersonalWorkspace(ContentRepositoryId $contentRepositoryId): array
    {
        $currentAccount = $this->securityContext->getAccount();
        assert($currentAccount !== null);
        // todo use \Neos\Neos\Service\UserService::getPersonalWorkspaceName instead?
        $personalWorkspaceName = WorkspaceNameBuilder::fromAccountIdentifier($currentAccount->getAccountIdentifier());

        $workspace = $this->workspaceProvider->provideForWorkspaceName(
            $contentRepositoryId,
            $personalWorkspaceName
        );

        return [
            'name' => $workspace->name,
            'totalNumberOfChanges' => $workspace->countAllChanges(),
            'publishableNodes' => $this->workspaceService->getPublishableNodeInfo($personalWorkspaceName, $contentRepositoryId),
            'baseWorkspace' => $workspace->getCurrentBaseWorkspaceName(),
            // TODO: FIX readonly flag!
            //'readOnly' => !$this->domainUserService->currentUserCanPublishToWorkspace($baseWorkspace)
            'readOnly' => false,
            'status' => $workspace->getCurrentStatus()
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
