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

use Neos\ContentRepository\Core\Projection\ContentGraph\ContentSubgraphInterface;
use Neos\ContentRepository\Core\Projection\ContentGraph\Filter\FindClosestNodeFilter;
use Neos\ContentRepository\Core\Projection\ContentGraph\Node;
use Neos\ContentRepository\Core\Projection\ContentGraph\VisibilityConstraints;
use Neos\ContentRepository\Core\SharedModel\ContentRepository\ContentRepositoryId;
use Neos\ContentRepository\Core\SharedModel\Node\NodeAddress;
use Neos\ContentRepository\Core\SharedModel\Node\NodeAggregateId;
use Neos\ContentRepository\Core\SharedModel\Workspace\WorkspaceName;
use Neos\ContentRepositoryRegistry\ContentRepositoryRegistry;
use Neos\Flow\Annotations as Flow;
use Neos\Neos\Domain\Model\SiteNodeName;
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
     * If $siteNodeName is given, only changes belonging to that site are returned. This matches the scope
     * of {@see WorkspacePublishingService::publishChangesInSite()} which the Neos UI uses for "publish all".
     * Without that restriction the UI would offer changes for publication that it cannot publish at all.
     * See https://github.com/neos/neos-ui/issues/4151 and https://github.com/neos/neos-ui/issues/3923
     *
     * @return array{contextPath:string,documentContextPath:string,typeOfChange:int}[]
     */
    public function getPublishableNodeInfo(WorkspaceName $workspaceName, ContentRepositoryId $contentRepositoryId, ?SiteNodeName $siteNodeName = null): array
    {
        $contentRepository = $this->contentRepositoryRegistry->get($contentRepositoryId);
        $contentGraph = $contentRepository->getContentGraph($workspaceName);
        $pendingChanges = $this->workspacePublishingService->pendingWorkspaceChanges($contentRepositoryId, $workspaceName);
        /** @var array{contextPath:string,documentContextPath:string,typeOfChange:int}[] $unpublishedNodes */
        $unpublishedNodes = [];
        foreach ($pendingChanges as $change) {
            if (method_exists($change, 'getLegacyRemovalAttachmentPoint') && $change->getLegacyRemovalAttachmentPoint() && $change->originDimensionSpacePoint !== null) {
                // deprecated LegacyRemovalAttachmentPoint handling
                if ($siteNodeName !== null) {
                    $subgraph = $contentGraph->getSubgraph(
                        $change->originDimensionSpacePoint->toDimensionSpacePoint(),
                        VisibilityConstraints::createEmpty()
                    );
                    if (!$this->changeBelongsToSite($subgraph, $change->getLegacyRemovalAttachmentPoint(), $siteNodeName)) {
                        continue;
                    }
                }

                $nodeAddress = NodeAddress::create(
                    $contentRepositoryId,
                    $workspaceName,
                    $change->originDimensionSpacePoint->toDimensionSpacePoint(),
                    $change->nodeAggregateId
                );

                /**
                 * See {@see Change::getLegacyRemovalAttachmentPoint()} -> Removal Attachment Point == closest document node.
                 */
                $documentNodeAddress = NodeAddress::create(
                    $contentRepositoryId,
                    $workspaceName,
                    $change->originDimensionSpacePoint->toDimensionSpacePoint(),
                    $change->getLegacyRemovalAttachmentPoint()
                );

                $unpublishedNodes[] = [
                    'contextPath' => $nodeAddress->toJson(),
                    'documentContextPath' => $documentNodeAddress->toJson(),
                    'typeOfChange' => $this->getTypeOfChange($change)
                ];
            } else {
                if ($change->originDimensionSpacePoint !== null) {
                    $originDimensionSpacePoints = [$change->originDimensionSpacePoint];
                } else {
                    // If originDimensionSpacePoint is null, we have a change to the nodeAggregate. All nodes in the
                    // occupied dimensionspacepoints shall be marked as changed.
                    $originDimensionSpacePoints = $contentGraph
                        ->findNodeAggregateById($change->nodeAggregateId)
                        ?->occupiedDimensionSpacePoints ?: [];
                }

                $contentGraph = $contentRepository->getContentGraph($workspaceName);
                foreach ($originDimensionSpacePoints as $originDimensionSpacePoint) {
                    $subgraph = $contentGraph->getSubgraph($originDimensionSpacePoint->toDimensionSpacePoint(), VisibilityConstraints::createEmpty());
                    $node = $subgraph->findNodeById($change->nodeAggregateId);
                    if ($node instanceof Node) {
                        if ($siteNodeName !== null && !$this->changeBelongsToSite($subgraph, $node->aggregateId, $siteNodeName)) {
                            continue;
                        }
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
        }

        return $unpublishedNodes;
    }

    /**
     * Whether the closest site node of the given node is the site we are currently working in
     */
    private function changeBelongsToSite(
        ContentSubgraphInterface $subgraph,
        NodeAggregateId $nodeAggregateId,
        SiteNodeName $siteNodeName
    ): bool {
        $siteNode = $subgraph->findClosestNode(
            $nodeAggregateId,
            FindClosestNodeFilter::create(nodeTypes: NodeTypeNameFactory::NAME_SITE)
        );

        return $siteNode?->name?->value === $siteNodeName->value;
    }

    // todo remove for now lol :D
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
