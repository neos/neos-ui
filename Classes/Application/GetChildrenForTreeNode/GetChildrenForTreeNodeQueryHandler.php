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

namespace Neos\Neos\Ui\Application\GetChildrenForTreeNode;

use Neos\ContentRepository\Core\Projection\ContentGraph\Filter\NodeType\NodeTypeCriteria;
use Neos\ContentRepository\Core\Projection\ContentGraph\Node;
use Neos\Flow\Annotations as Flow;
use Neos\Neos\Ui\Application\Shared\TreeNodes;
use Neos\Neos\Ui\Infrastructure\ESCR\NodeService;
use Neos\Neos\Ui\Infrastructure\ESCR\NodeServiceFactory;
use Neos\Neos\Ui\Infrastructure\ESCR\NodeTypeService;
use Neos\Neos\Ui\Infrastructure\ESCR\NodeTypeServiceFactory;

/**
 * @internal
 */
#[Flow\Scope("singleton")]
final class GetChildrenForTreeNodeQueryHandler
{
    #[Flow\Inject]
    protected NodeServiceFactory $nodeServiceFactory;

    #[Flow\Inject]
    protected NodeTypeServiceFactory $nodeTypeServiceFactory;

    public function handle(GetChildrenForTreeNodeQuery $query): GetChildrenForTreeNodeQueryResult
    {
        $nodeService = $this->nodeServiceFactory->create(
            contentRepositoryId: $query->contentRepositoryId,
            workspaceName: $query->workspaceName,
            dimensionSpacePoint: $query->dimensionSpacePoint,
        );
        $nodeTypeService = $this->nodeTypeServiceFactory->create(
            contentRepositoryId: $query->contentRepositoryId,
        );

        $node = $nodeService->requireNodeById($query->treeNodeId);

        return new GetChildrenForTreeNodeQueryResult(
            children: $this->createTreeNodesFromChildrenOfNode($nodeService, $nodeTypeService, $node, $query),
        );
    }

    private function createTreeNodesFromChildrenOfNode(NodeService $nodeService, NodeTypeService $nodeTypeService, Node $node, GetChildrenForTreeNodeQuery $query): TreeNodes
    {
        $items = [];
        $nodeTypeCriteria = NodeTypeCriteria::fromFilterString($query->nodeTypeFilter);

        foreach ($nodeService->findChildNodes($node, $nodeTypeCriteria) as $childNode) {
            /** @var Node $childNode */
            $items[] = $nodeService->createTreeNodeBuilderForNode($childNode)
                ->setIsMatchedByFilter(true)
                ->setHasUnloadedChildren($nodeService->getNumberOfChildNodes($childNode, $nodeTypeCriteria) > 0)
                ->build();
        }

        return new TreeNodes(...$items);
    }
}
