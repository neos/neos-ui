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

namespace Neos\Neos\Ui\LinkEditor\Application\GetTree;

use Neos\ContentRepository\Core\Projection\ContentGraph\AbsoluteNodePath;
use Neos\ContentRepository\Core\Projection\ContentGraph\Node;
use Neos\ContentRepository\Core\SharedModel\Node\NodeAggregateId;
use Neos\Flow\Annotations as Flow;
use Neos\Neos\Ui\LinkEditor\Application\Shared\TreeNode;
use Neos\Neos\Ui\LinkEditor\Infrastructure\ESCR\LinkableNodeSpecification;
use Neos\Neos\Ui\LinkEditor\Infrastructure\ESCR\NodeSearchSpecification;
use Neos\Neos\Ui\LinkEditor\Infrastructure\ESCR\NodeService;
use Neos\Neos\Ui\LinkEditor\Infrastructure\ESCR\NodeServiceFactory;
use Neos\Neos\Ui\LinkEditor\Infrastructure\ESCR\NodeTypeService;
use Neos\Neos\Ui\LinkEditor\Infrastructure\ESCR\NodeTypeServiceFactory;

/**
 * @internal
 */
#[Flow\Scope("singleton")]
final class GetTreeQueryHandler
{
    #[Flow\Inject]
    protected NodeServiceFactory $nodeServiceFactory;

    #[Flow\Inject]
    protected NodeTypeServiceFactory $nodeTypeServiceFactory;

    public function handle(GetTreeQuery $query): GetTreeQueryResult
    {
        $nodeService = $this->nodeServiceFactory->create(
            contentRepositoryId: $query->contentRepositoryId,
            workspaceName: $query->workspaceName,
            dimensionSpacePoint: $query->dimensionSpacePoint,
        );
        $nodeTypeService = $this->nodeTypeServiceFactory->create(
            contentRepositoryId: $query->contentRepositoryId,
        );

        $rootNode = match ($query->startingPoint::class) {
            NodeAggregateId::class => $nodeService->findNodeById($query->startingPoint) ?? throw StartingPointWasNotFound::becauseNodeWithGivenIdNotExistInCurrentSubgraph(
                nodeAggregateId: $query->startingPoint,
                subgraph: $nodeService->subgraph,
            ),
            AbsoluteNodePath::class => $nodeService->findNodeByAbsoluteNodePath($query->startingPoint) ?? throw StartingPointWasNotFound::becauseNodeWithGivenPathDoesNotExistInCurrentSubgraph(
                nodePath: $query->startingPoint,
                subgraph: $nodeService->subgraph,
            ),
        };

        return new GetTreeQueryResult(
            root: empty($query->searchTerm) && empty($query->narrowNodeTypeFilter)
                ? $this->loadTree($nodeService, $nodeTypeService, $rootNode, $query, $query->loadingDepth)
                : $this->performSearch($nodeService, $nodeTypeService, $rootNode, $query),
        );
    }

    private function performSearch(
        NodeService $nodeService,
        NodeTypeService $nodeTypeService,
        Node $rootNode,
        GetTreeQuery $query,
    ): TreeNode {
        $baseNodeTypeFilter = $nodeTypeService->createNodeTypeFilterFromFilterString(
            filterString: $query->baseNodeTypeFilter,
        );
        $narrowNodeTypeFilter = $nodeTypeService->createNodeTypeFilterFromFilterString(
            filterString: $query->narrowNodeTypeFilter,
        );

        $matchingNodes = $nodeService->search(
            rootNode: $rootNode,
            searchTerm: $query->searchTerm,
            nodeTypeFilter: $narrowNodeTypeFilter,
        );

        $treeBuilder = $nodeService->createTreeBuilderForRootNode(
            rootNode: $rootNode,
            nodeSearchSpecification: new NodeSearchSpecification(
                baseNodeTypeFilter: $baseNodeTypeFilter,
                narrowNodeTypeFilter: $narrowNodeTypeFilter,
                searchTerm: $query->searchTerm,
                nodeService: $nodeService,
            ),
            linkableNodeSpecification: new LinkableNodeSpecification(
                linkableNodeTypes: $nodeTypeService->createNodeTypeFilterFromNodeTypeNames(
                    nodeTypeNames: $query->linkableNodeTypes,
                ),
            ),
        );

        foreach ($matchingNodes as $matchingNode) {
            $treeBuilder->addNodeWithAncestors(
                node: $matchingNode,
                ancestors: $nodeService->findAncestorNodes($matchingNode),
            );
        }

        return $treeBuilder->build();
    }

    private function loadTree(
        NodeService $nodeService,
        NodeTypeService $nodeTypeService,
        Node $node,
        GetTreeQuery $query,
        int $remainingDepth,
    ): TreeNode {
        $baseNodeTypeFilter = $nodeTypeService->createNodeTypeFilterFromFilterString(
            filterString: $query->baseNodeTypeFilter,
        );

        $treeBuilder = $nodeService->createTreeBuilderForRootNode(
            rootNode: $node,
            nodeSearchSpecification: new NodeSearchSpecification(
                baseNodeTypeFilter: $baseNodeTypeFilter,
                narrowNodeTypeFilter: null,
                searchTerm: null,
                nodeService: $nodeService,
            ),
            linkableNodeSpecification: new LinkableNodeSpecification(
                linkableNodeTypes: $nodeTypeService->createNodeTypeFilterFromNodeTypeNames(
                    nodeTypeNames: $query->linkableNodeTypes,
                ),
            ),
        );

        $treeBuilder->addNodeWithDescendants($node, $remainingDepth);

        if ($query->selectedNodeId) {
            if ($treeBuilder->containsNodeTreeByNodeAggregateId($query->selectedNodeId) === false) {
                $selectedNode = $nodeService->findNodeById($query->selectedNodeId);
                if ($selectedNode) {
                    $treeBuilder->addNodeWithSiblingsAndAncestors($selectedNode);
                }
            }
        }

        return $treeBuilder->build();
    }
}
