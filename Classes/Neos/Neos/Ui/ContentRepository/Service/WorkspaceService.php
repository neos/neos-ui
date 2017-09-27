<?php
namespace Neos\Neos\Ui\ContentRepository\Service;

use Neos\Flow\Annotations as Flow;
use Neos\ContentRepository\Domain\Model\Workspace;
use Neos\ContentRepository\Domain\Repository\WorkspaceRepository;
use Neos\Neos\Domain\Model\User;
use Neos\Neos\Service\UserService;
use Neos\Neos\Domain\Service\UserService as DomainUserService;
use Neos\Neos\Service\PublishingService;
use Neos\Eel\FlowQuery\FlowQuery;

/**
 * @Flow\Scope("singleton")
 */
class WorkspaceService
{
    /**
     * @Flow\Inject
     * @var PublishingService
     */
    protected $publishingService;

    /**
     * @Flow\Inject
     * @var NodeService
     */
    protected $nodeService;

    /**
     * @Flow\Inject
     * @var WorkspaceRepository
     */
    protected $workspaceRepository;

    /**
     * @Flow\Inject
     * @var UserService
     */
    protected $userService;

    /**
     * @Flow\Inject
     * @var DomainUserService
     */
    protected $domainUserService;

    /**
     * Get all publishable node context paths for a workspace
     *
     * @param Workspace $workspace
     * @return array
     */
    public function getPublishableNodeInfo(Workspace $workspace)
    {
        $publishableNodes = $this->publishingService->getUnpublishedNodes($workspace);

        $publishableNodes = array_map(function ($node) {
            if ($documentNode = $this->nodeService->getClosestDocument($node)) {
                return [
                    'contextPath' => $node->getContextPath(),
                    'documentContextPath' => $documentNode->getContextPath()
                ];
            }
        }, $publishableNodes);

        return array_filter($publishableNodes, function ($item) {
            return (bool)$item;
        });
    }

    /**
     * Get allowed target workspaces for current user
     *
     * @return array
     */
    public function getAllowedTargetWorkspaces()
    {
        $user = $this->domainUserService->getCurrentUser();

        $workspacesArray = [];
        /** @var Workspace $workspace */
        foreach ($this->workspaceRepository->findAll() as $workspace) {
            // FIXME: This check should be implemented through a specialized Workspace Privilege or something similar
            // Skip workspace not owned by current user
            if ($workspace->getOwner() !== null && $workspace->getOwner() !== $user) {
                continue;
            }
            // Skip own personal workspace
            if ($workspace === $this->userService->getPersonalWorkspace()) {
                continue;
            }

            $workspaceArray = [
                'name' => $workspace->getName(),
                'title' => $workspace->getTitle(),
                'description' => $workspace->getDescription(),
                'readonly' => !$this->domainUserService->currentUserCanPublishToWorkspace($workspace)
            ];
            $workspacesArray[$workspace->getName()] = $workspaceArray;
        }

        return $workspacesArray;
    }

    /**
     * Sets base workspace of current user workspace
     *
     * @param Workspace $workspace
     * @return void
     */
    public function setBaseWorkspace(Workspace $workspace)
    {
        $userWorkspace = $this->userService->getPersonalWorkspace();
        $userWorkspace->setBaseWorkspace($workspace);
    }
}
