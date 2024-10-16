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

use Neos\ContentRepository\Core\Projection\ContentGraph\Filter\FindClosestNodeFilter;
use Neos\ContentRepository\Core\Projection\ContentGraph\Node;
use Neos\ContentRepository\Core\Projection\ContentGraph\VisibilityConstraints;
use Neos\ContentRepository\Core\SharedModel\Node\NodeAddress;
use Neos\ContentRepository\Core\SharedModel\ContentRepository\ContentRepositoryId;
use Neos\ContentRepository\Core\SharedModel\Workspace\WorkspaceName;
use Neos\ContentRepositoryRegistry\ContentRepositoryRegistry;
use Neos\Flow\Annotations as Flow;
use Neos\Neos\Domain\Service\NodeTypeNameFactory;
use Neos\Neos\Domain\Service\WorkspacePublishingService;
use Neos\Neos\PendingChangesProjection\Change;
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

    #[Flow\Inject]
    protected WorkspacePublishingService $workspacePublishingService;

    /**
     * Get all publishable node context paths for a workspace
     *
     * @return array{contextPath:string,documentContextPath:string,typeOfChange:int}[]
     */
    public function getPublishableNodeInfo(WorkspaceName $workspaceName, ContentRepositoryId $contentRepositoryId): array
    {
        $contentRepository = $this->contentRepositoryRegistry->get($contentRepositoryId);
        $pendingChanges = $this->workspacePublishingService->pendingWorkspaceChanges($contentRepositoryId, $workspaceName);
        /** @var array{contextPath:string,documentContextPath:string,typeOfChange:int}[] $unpublishedNodes */
        $unpublishedNodes = [];
        foreach ($pendingChanges as $change) {
            if ($change->removalAttachmentPoint) {
                $nodeAddress = NodeAddress::create(
                    $contentRepositoryId,
                    $workspaceName,
                    $change->originDimensionSpacePoint->toDimensionSpacePoint(),
                    $change->nodeAggregateId
                );

                /**
                 * See {@see Remove::apply} -> Removal Attachment Point == closest document node.
                 */
                $documentNodeAddress = NodeAddress::create(
                    $contentRepositoryId,
                    $workspaceName,
                    $change->originDimensionSpacePoint->toDimensionSpacePoint(),
                    $change->removalAttachmentPoint
                );

                $unpublishedNodes[] = [
                    'contextPath' => $nodeAddress->toJson(),
                    'documentContextPath' => $documentNodeAddress->toJson(),
                    'typeOfChange' => $this->getTypeOfChange($change)
                ];
            } else {
                $subgraph = $contentRepository->getContentGraph($workspaceName)->getSubgraph(
                    $change->originDimensionSpacePoint->toDimensionSpacePoint(),
                    VisibilityConstraints::withoutRestrictions()
                );
                $node = $subgraph->findNodeById($change->nodeAggregateId);

                if ($node instanceof Node) {
                    $documentNode = $subgraph->findClosestNode($node->aggregateId, FindClosestNodeFilter::create(nodeTypes: NodeTypeNameFactory::NAME_DOCUMENT));
                    if ($documentNode instanceof Node) {
                        $unpublishedNodes[] = [
                            'contextPath' => NodeAddress::fromNode($node)->toJson(),
                            'documentContextPath' => NodeAddress::fromNode($documentNode)->toJson(),
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
