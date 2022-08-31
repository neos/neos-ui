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
use Neos\ContentRepository\Core\Factory\ContentRepositoryIdentifier;
use Neos\ContentRepository\Core\Projection\ContentGraph\ContentSubgraphIdentity;
use Neos\ContentRepository\Core\Projection\ContentGraph\Node;
use Neos\ContentRepository\Core\Projection\Workspace\Workspace;
use Neos\Neos\FrontendRouting\NodeAddress;
use Neos\Neos\FrontendRouting\NodeAddressFactory;
use Neos\ContentRepository\Core\Projection\ContentGraph\VisibilityConstraints;
use Neos\ContentRepository\Core\SharedModel\Workspace\WorkspaceName;
use Neos\ContentRepositoryRegistry\ContentRepositoryRegistry;
use Neos\Flow\Annotations as Flow;
use Neos\Neos\Domain\Service\UserService as DomainUserService;
use Neos\Neos\PendingChangesProjection\ChangeProjection;
use Neos\Neos\Service\UserService;

/**
 * @Flow\Scope("singleton")
 */
class WorkspaceService
{

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
     * @Flow\Inject
     * @var ContentRepositoryRegistry
     */
    protected $contentRepositoryRegistry;

    /**
     * Get all publishable node context paths for a workspace
     *
     * @return array<int,array<string,string>>
     */
    public function getPublishableNodeInfo(WorkspaceName $workspaceName, ContentRepositoryIdentifier $contentRepositoryIdentifier): array
    {
        $contentRepository = $this->contentRepositoryRegistry->get($contentRepositoryIdentifier);
        $workspace = $contentRepository->getWorkspaceFinder()->findOneByName($workspaceName);
        if (is_null($workspace) || $workspace->baseWorkspaceName === null) {
            return [];
        }
        $changeFinder = $contentRepository->projectionState(ChangeProjection::class);
        $changes = $changeFinder->findByContentStreamIdentifier($workspace->currentContentStreamIdentifier);
        $unpublishedNodes = [];
        foreach ($changes as $change) {
            if ($change->removalAttachmentPoint) {
                $nodeAddress = new NodeAddress(
                    $change->contentStreamIdentifier,
                    $change->originDimensionSpacePoint->toDimensionSpacePoint(),
                    $change->nodeAggregateIdentifier,
                    $workspaceName
                );

                /**
                 * See {@see Remove::apply} -> Removal Attachment Point == closest document node.
                 */
                $documentNodeAddress = new NodeAddress(
                    $change->contentStreamIdentifier,
                    $change->originDimensionSpacePoint->toDimensionSpacePoint(),
                    $change->removalAttachmentPoint,
                    $workspaceName
                );

                $unpublishedNodes[] = [
                    'contextPath' => $nodeAddress->serializeForUri(),
                    'documentContextPath' => $documentNodeAddress->serializeForUri()
                ];
            } else {
                $subgraph = $contentRepository->getContentGraph()->getSubgraph(
                    $workspace->currentContentStreamIdentifier,
                    $change->originDimensionSpacePoint->toDimensionSpacePoint(),
                    VisibilityConstraints::withoutRestrictions()
                );
                $node = $subgraph->findNodeByNodeAggregateIdentifier($change->nodeAggregateIdentifier);

                if ($node instanceof Node) {
                    $documentNode = $this->getClosestDocumentNode($node);
                    if ($documentNode instanceof Node) {
                        $contentRepository = $this->contentRepositoryRegistry->get($documentNode->subgraphIdentity->contentRepositoryIdentifier);
                        $nodeAddressFactory = NodeAddressFactory::create($contentRepository);
                        $unpublishedNodes[] = [
                            'contextPath' => $nodeAddressFactory->createFromNode($node)->serializeForUri(),
                            'documentContextPath' => $nodeAddressFactory->createFromNode($documentNode)
                                ->serializeForUri()
                        ];
                    }
                }
            }
        }

        return array_filter($unpublishedNodes, function ($item) {
            return (bool)$item;
        });
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
        /** @var Workspace $workspace */
        foreach ($contentRepository->getWorkspaceFinder()->findAll() as $workspace) {
            // FIXME: This check should be implemented through a specialized Workspace Privilege or something similar
            // Skip workspace not owned by current user
            if ($workspace->workspaceOwner !== null && $workspace->workspaceOwner !== $user) {
                continue;
            }
            // Skip own personal workspace
            if ($workspace->workspaceName->name === $this->userService->getPersonalWorkspaceName()) {
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

    private function getClosestDocumentNode(Node $node): ?Node
    {
        $subgraph = $this->contentRepositoryRegistry->subgraphForNode($node);

        while ($node instanceof Node) {
            if ($node->nodeType->isOfType('Neos.Neos:Document')) {
                return $node;
            }
            $node = $subgraph->findParentNode($node->nodeAggregateIdentifier);
        }

        return null;
    }
}
