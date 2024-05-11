<?php
namespace Neos\Neos\Ui\ContentRepository\Service;

/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

use Neos\ContentRepository\Core\ContentRepository;
use Neos\ContentRepository\Core\SharedModel\ContentRepository\ContentRepositoryId;
use Neos\ContentRepository\Core\Projection\ContentGraph\Filter\FindClosestNodeFilter;
use Neos\ContentRepository\Core\Projection\ContentGraph\Node;
use Neos\Neos\Domain\Service\NodeTypeNameFactory;
use Neos\Neos\FrontendRouting\NodeAddress;
use Neos\Neos\FrontendRouting\NodeAddressFactory;
use Neos\ContentRepository\Core\Projection\ContentGraph\VisibilityConstraints;
use Neos\ContentRepository\Core\SharedModel\Workspace\WorkspaceName;
use Neos\ContentRepositoryRegistry\ContentRepositoryRegistry;
use Neos\Flow\Annotations as Flow;
use Neos\Neos\Domain\Service\UserService as DomainUserService;
use Neos\Neos\PendingChangesProjection\Change;
use Neos\Neos\PendingChangesProjection\ChangeFinder;
use Neos\Neos\Service\UserService;
use Neos\Neos\Utility\NodeTypeWithFallbackProvider;

/**
 * @internal
 * @Flow\Scope("singleton")
 */
class WorkspaceService
{
    private const NODE_HAS_BEEN_CREATED = 0b0001;
    private const NODE_HAS_BEEN_CHANGED = 0b0010;
    private const NODE_HAS_BEEN_MOVED = 0b0100;
    private const NODE_HAS_BEEN_DELETED = 0b1000;

    use NodeTypeWithFallbackProvider;

    #[Flow\Inject]
    protected ContentRepositoryRegistry $contentRepositoryRegistry;

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
     * @return array{contextPath:string,documentContextPath:string,typeOfChange:int}[]
     */
    public function getPublishableNodeInfo(WorkspaceName $workspaceName, ContentRepositoryId $contentRepositoryId): array
    {
        $contentRepository = $this->contentRepositoryRegistry->get($contentRepositoryId);
        $workspace = $contentRepository->getWorkspaceFinder()->findOneByName($workspaceName);
        if (is_null($workspace) || $workspace->baseWorkspaceName === null) {
            return [];
        }
        $changeFinder = $contentRepository->projectionState(ChangeFinder::class);
        $changes = $changeFinder->findByContentStreamId($workspace->currentContentStreamId);
        /** @var array{contextPath:string,documentContextPath:string,typeOfChange:int}[] $unpublishedNodes */
        $unpublishedNodes = [];
        foreach ($changes as $change) {
            if ($change->removalAttachmentPoint) {
                $nodeAddress = new NodeAddress(
                    $change->contentStreamId,
                    $change->originDimensionSpacePoint->toDimensionSpacePoint(),
                    $change->nodeAggregateId,
                    $workspaceName
                );

                /**
                 * See {@see Remove::apply} -> Removal Attachment Point == closest document node.
                 */
                $documentNodeAddress = new NodeAddress(
                    $change->contentStreamId,
                    $change->originDimensionSpacePoint->toDimensionSpacePoint(),
                    $change->removalAttachmentPoint,
                    $workspaceName
                );

                $unpublishedNodes[] = [
                    'contextPath' => $nodeAddress->serializeForUri(),
                    'documentContextPath' => $documentNodeAddress->serializeForUri(),
                    'typeOfChange' => $this->getTypeOfChange($change)
                ];
            } else {
                $subgraph = $contentRepository->getContentGraph($workspaceName)->getSubgraph(
                    $change->originDimensionSpacePoint->toDimensionSpacePoint(),
                    VisibilityConstraints::withoutRestrictions()
                );
                $node = $subgraph->findNodeById($change->nodeAggregateId);

                if ($node instanceof Node) {
                    $documentNode = $subgraph->findClosestNode($node->nodeAggregateId, FindClosestNodeFilter::create(nodeTypes: NodeTypeNameFactory::NAME_DOCUMENT));
                    if ($documentNode instanceof Node) {
                        $contentRepository = $this->contentRepositoryRegistry->get($documentNode->subgraphIdentity->contentRepositoryId);
                        $nodeAddressFactory = NodeAddressFactory::create($contentRepository);
                        $unpublishedNodes[] = [
                            'contextPath' => $nodeAddressFactory->createFromNode($node)->serializeForUri(),
                            'documentContextPath' => $nodeAddressFactory->createFromNode($documentNode)
                                ->serializeForUri(),
                            'typeOfChange' => $this->getTypeOfChange($change)
                        ];
                    }
                }
            }
        }

        return array_values(array_filter($unpublishedNodes, function ($item) {
            return (bool)$item;
        }));
    }

    /**
     * Get allowed target workspaces for current user
     *
     * @return array<string,array<string,mixed>>
     */
    public function getAllowedTargetWorkspaces(ContentRepository $contentRepository): array
    {
        $user = $this->domainUserService->getCurrentUser();

        $workspacesArray = [];
        foreach ($contentRepository->getWorkspaceFinder()->findAll() as $workspace) {
            // FIXME: This check should be implemented through a specialized Workspace Privilege or something similar
            // Skip workspace not owned by current user
            if ($workspace->workspaceOwner !== null && $workspace->workspaceOwner !== $user) {
                continue;
            }
            // Skip own personal workspace
            if ($workspace->workspaceName->value === $this->userService->getPersonalWorkspaceName()) {
                continue;
            }

            if ($workspace->isPersonalWorkspace()) {
                // Skip other personal workspaces
                continue;
            }

            $workspaceArray = [
                'name' => $workspace->workspaceName->jsonSerialize(),
                'title' => $workspace->workspaceTitle->jsonSerialize(),
                'description' => $workspace->workspaceDescription->jsonSerialize(),
                'readonly' => !$this->domainUserService->currentUserCanPublishToWorkspace($workspace)
            ];
            $workspacesArray[$workspace->workspaceName->jsonSerialize()] = $workspaceArray;
        }

        return $workspacesArray;
    }

    private function getTypeOfChange(Change $change): int
    {
        $result = 0;

        if ($change->created) {
            $result = $result | self::NODE_HAS_BEEN_CREATED;
        }

        if ($change->changed) {
            $result = $result | self::NODE_HAS_BEEN_CHANGED;
        }

        if ($change->moved) {
            $result = $result | self::NODE_HAS_BEEN_MOVED;
        }

        if ($change->deleted) {
            $result = $result | self::NODE_HAS_BEEN_DELETED;
        }

        return $result;
    }
}
