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

namespace Neos\Neos\Ui\Application\ReloadNodes;

use Neos\ContentRepository\Core\Projection\ContentGraph\Filter\FindAncestorNodesFilter;
use Neos\ContentRepository\Core\Projection\ContentGraph\Filter\FindChildNodesFilter;
use Neos\ContentRepository\Core\Projection\ContentGraph\Filter\NodeType\NodeTypeCriteria;
use Neos\ContentRepository\Core\Projection\ContentGraph\Node;
use Neos\ContentRepository\Core\Projection\ContentGraph\VisibilityConstraints;
use Neos\ContentRepositoryRegistry\ContentRepositoryRegistry;
use Neos\Flow\Annotations as Flow;
use Neos\Flow\Mvc\ActionRequest;
use Neos\Neos\Domain\Service\NodeTypeNameFactory;
use Neos\Neos\Domain\Workspace\WorkspaceProvider;
use Neos\Neos\FrontendRouting\NodeAddressFactory;
use Neos\Neos\Ui\Fusion\Helper\NodeInfoHelper;

/**
 * The application layer level query handler to find all nodes the UI needs
 * to refresh the document tree
 *
 * @internal for communication within the Neos UI only
 */
#[Flow\Scope("singleton")]
final class ReloadNodesQueryHandler
{
    #[Flow\Inject]
    protected WorkspaceProvider $workspaceProvider;

    #[Flow\Inject]
    protected ContentRepositoryRegistry $contentRepositoryRegistry;

    #[Flow\Inject]
    protected NodeInfoHelper $nodeInfoHelper;

    #[Flow\InjectConfiguration(path: 'userInterface.navigateComponent.nodeTree.presets.default.baseNodeType', package: 'Neos.Neos')]
    protected string $baseNodeType;

    #[Flow\InjectConfiguration(path: 'userInterface.navigateComponent.nodeTree.loadingDepth', package: 'Neos.Neos')]
    protected int $loadingDepth;

    public function handle(ReloadNodesQuery $query, ActionRequest $actionRequest): ReloadNodesQueryResult
    {
        $workspace = $this->workspaceProvider->provideForWorkspaceName(
            $query->contentRepositoryId,
            $query->workspaceName
        );
        $contentRepository = $this->contentRepositoryRegistry
            ->get($query->contentRepositoryId);
        $subgraph = $contentRepository->getContentGraph()->getSubgraph(
            $workspace->getCurrentContentStreamId(),
            $query->dimensionSpacePoint,
            VisibilityConstraints::withoutRestrictions()
        );
        $baseNodeTypeConstraints = NodeTypeCriteria::fromFilterString($this->baseNodeType);

        $documentNode = $subgraph->findNodeById($query->documentId);
        if ($documentNode === null) {
            foreach ($query->ancestorsOfDocumentIds as $ancestorOfDocumentId) {
                $documentNode = $subgraph->findNodeById($ancestorOfDocumentId);
                if ($documentNode) {
                    break;
                }
            }
        }

        if ($documentNode === null) {
            throw new NoDocumentNodeWasFound(
                sprintf(
                    'The document node with NodeAddress "%s" was not found.',
                    $query->documentId->value
                ),
                1712584572
            );
        }

        $siteNode = $subgraph->findNodeById($query->siteId);
        if ($siteNode === null) {
            throw new NoSiteNodeWasFound(
                sprintf(
                    'The site node with NodeAddress "%s" was not found.',
                    $query->siteId->value
                ),
                1712584589
            );
        }

        $ancestors = $subgraph->findAncestorNodes(
            $documentNode->nodeAggregateId,
            FindAncestorNodesFilter::create(
                NodeTypeCriteria::fromFilterString(NodeTypeNameFactory::NAME_DOCUMENT)
            )
        );

        $nodeMapBuilder = NodeMap::builder(
            MinimalNodeForTree::class,
            $this->nodeInfoHelper,
            $actionRequest
        );
        $nodeMapBuilder->addNode($siteNode);

        $gatherNodesRecursively = function (
            &$nodeMapBuilder,
            Node $baseNode,
            $level = 0
        ) use (
            &$gatherNodesRecursively,
            $baseNodeTypeConstraints,
            $query,
            $ancestors,
            $subgraph
        ) {
            if ($level < $this->loadingDepth || // load all nodes within loadingDepth
                $this->loadingDepth === 0 || // unlimited loadingDepth
                // load toggled nodes
                $query->toggledNodesIds->contain($baseNode->nodeAggregateId) ||
                // load children of all parents of documentNode
                in_array($baseNode->nodeAggregateId->value, array_map(
                    fn (Node $node): string => $node->nodeAggregateId->value,
                    iterator_to_array($ancestors)
                ))
            ) {
                foreach ($subgraph->findChildNodes(
                    $baseNode->nodeAggregateId,
                    FindChildNodesFilter::create(nodeTypes: $baseNodeTypeConstraints)
                ) as $childNode) {
                    $nodeMapBuilder->addNode($childNode);
                    $gatherNodesRecursively($nodeMapBuilder, $childNode, $level + 1);
                }
            }
        };
        $gatherNodesRecursively($nodeMapBuilder, $siteNode);

        $nodeMapBuilder->addNode($documentNode);

        foreach ($query->clipboardNodesIds as $clipboardNodeId) {
            // TODO: does not work across multiple CRs yet.
            $clipboardNode = $subgraph->findNodeById($clipboardNodeId);
            if ($clipboardNode) {
                $nodeMapBuilder->addNode($clipboardNode);
            }
        }

        /* TODO: we might use the Subtree as this may be more efficient
         - but the logic above mirrors the old behavior better.
        if ($loadingDepth === 0) {
            throw new \RuntimeException('TODO: Loading Depth 0 not supported');
        }
        $subtree = $contentSubgraph->findSubtree([$siteNode], $loadingDepth, $nodeTypeConstraints);
        $subtree = $subtree->getChildren()[0];
        $this->flattenSubtreeToNodeList($nodeAccessor, $subtree, $nodeMapBuilder);*/

        $nodeAddressFactory = NodeAddressFactory::create($contentRepository);

        return new ReloadNodesQueryResult(
            documentId: $nodeAddressFactory->createFromNode($documentNode),
            nodes: $nodeMapBuilder->build()
        );
    }
}
