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

use Neos\ContentRepositoryRegistry\ContentRepositoryRegistry;
use Neos\ContentRepositoryRegistry\ValueObject\ContentRepositoryIdentifier;
use Neos\Eel\ProtectedContextAwareInterface;
use Neos\ContentRepository\SharedModel\Workspace\WorkspaceName;
use Neos\Neos\Domain\Model\WorkspaceName as NeosWorkspaceName;
use Neos\Flow\Security\Context;
use Neos\Neos\Domain\Service\UserService as DomainUserService;
use Neos\Flow\Annotations as Flow;
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

    public function getAllowedTargetWorkspaces(ContentRepositoryIdentifier $contentRepositoryIdentifier)
    {
        $contentRepository = $this->contentRepositoryRegistry->get($contentRepositoryIdentifier);
        return $this->workspaceService->getAllowedTargetWorkspaces($contentRepository);
    }

    /**
     * @return array<string,mixed>
     */
    public function getPersonalWorkspace(ContentRepositoryIdentifier $contentRepositoryIdentifier): array
    {
        $contentRepository = $this->contentRepositoryRegistry->get($contentRepositoryIdentifier);
        $currentAccount = $this->securityContext->getAccount();
        $personalWorkspaceName = NeosWorkspaceName::fromAccountIdentifier(
            $currentAccount->getAccountIdentifier()
        )->toContentRepositoryWorkspaceName();
        $personalWorkspace = $contentRepository->getWorkspaceFinder()->findOneByName($personalWorkspaceName);

        return !is_null($personalWorkspace)
            ? [
                'name' => $personalWorkspace->getWorkspaceName(),
                'publishableNodes' => $this->workspaceService->getPublishableNodeInfo($personalWorkspaceName, $contentRepositoryIdentifier),
                'baseWorkspace' => $personalWorkspace->getBaseWorkspaceName(),
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
