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

use Neos\ContentRepository\Core\Factory\ContentRepositoryId;
use Neos\ContentRepositoryRegistry\ContentRepositoryRegistry;
use Neos\Eel\ProtectedContextAwareInterface;
use Neos\Flow\Annotations as Flow;
use Neos\Flow\Security\Context;
use Neos\Neos\Domain\Service\UserService as DomainUserService;
use Neos\Neos\Domain\Service\WorkspaceNameBuilder;
use Neos\Neos\Ui\ContentRepository\Service\WorkspaceService;

/**
 * The Workspace helper for EEL contexts
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
     * @var DomainUserService
     */
    protected $domainUserService;

    /**
     * @Flow\Inject
     * @var Context
     */
    protected $securityContext;

    public function getAllowedTargetWorkspaces(ContentRepositoryId $contentRepositoryId)
    {
        $contentRepository = $this->contentRepositoryRegistry->get($contentRepositoryId);
        return $this->workspaceService->getAllowedTargetWorkspaces($contentRepository);
    }

    /**
     * @return array<string,mixed>
     */
    public function getPersonalWorkspace(ContentRepositoryId $contentRepositoryId): array
    {
        $contentRepository = $this->contentRepositoryRegistry->get($contentRepositoryId);
        $currentAccount = $this->securityContext->getAccount();
        $personalWorkspaceName = WorkspaceNameBuilder::fromAccountIdentifier($currentAccount->getAccountIdentifier());
        $personalWorkspace = $contentRepository->getWorkspaceFinder()->findOneByName($personalWorkspaceName);

        return !is_null($personalWorkspace)
            ? [
                'name' => $personalWorkspace->workspaceName,
                'publishableNodes' => $this->workspaceService->getPublishableNodeInfo($personalWorkspaceName, $contentRepositoryId),
                'baseWorkspace' => $personalWorkspace->baseWorkspaceName,
                // TODO: FIX readonly flag!
                //'readOnly' => !$this->domainUserService->currentUserCanPublishToWorkspace($baseWorkspace)
                'readOnly' => false
            ]
            : [];
    }

    /**
     * All methods are considered safe
     *
     * @param string $methodName
     * @return bool
     */
    public function allowsCallOfMethod($methodName)
    {
        return true;
    }
}
