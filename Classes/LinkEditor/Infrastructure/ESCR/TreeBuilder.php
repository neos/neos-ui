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

namespace Neos\Neos\Ui\LinkEditor\Infrastructure\ESCR;

use Neos\ContentRepository\Core\Projection\ContentGraph\Node;
use Neos\ContentRepository\Core\Projection\ContentGraph\Nodes;
use Neos\ContentRepository\Core\SharedModel\Node\NodeAggregateId;
use Neos\Flow\Annotations as Flow;
use Neos\Neos\Ui\LinkEditor\Application\Shared\TreeNode;
use Neos\Neos\Ui\LinkEditor\Application\Shared\TreeNodeBuilder;

/**
 * @internal
 */
#[Flow\Proxy(false)]
final class TreeBuilder
{
    /** @var array<string,TreeNodeBuilder> */
    private array $treeNodeBuildersByNodeAggregateIdentifier;

    public function __construct(
        Node $rootNode,
        private readonly NodeService $nodeService,
        private readonly TreeNodeBuilder $rootTreeNodeBuilder,
        private readonly NodeSearchSpecification $nodeSearchSpecification,
        private readonly LinkableNodeSpecification $linkableNodeSpecification,
    ) {
        $this->treeNodeBuildersByNodeAggregateIdentifier[$rootNode->aggregateId->value] = $rootTreeNodeBuilder;
    }

    public function containsNodeTreeByNodeAggregateId(NodeAggregateId $nodeAggregateId): bool
    {
        return $this->rootTreeNodeBuilder->containsNodeTreeByNodeAggregateId($nodeAggregateId);
    }

    public function addNodeWithDescendants(Node $node, int $loadingDepth): self
    {
        $addNodeWithChildrenRecursively = function (Node $node, int $loadingDepth) use (&$addNodeWithChildrenRecursively): TreeNodeBuilder {
            $treeNodeBuilder = $this->addNode($node);

            if ($loadingDepth === 0) {
                $treeNodeBuilder->setHasUnloadedChildren(
                    $this->nodeService->getNumberOfChildNodes($node, $this->nodeSearchSpecification->baseNodeTypeFilter->nodeTypeCriteria) > 0,
                );
            } else {
                $childNodes = $this->nodeService->findChildNodes(
                    $node,
                    $this->nodeSearchSpecification->baseNodeTypeFilter->nodeTypeCriteria
                );

                foreach ($childNodes as $childNode) {
                    /** @var Node $childNode */
                    $treeNodeBuilder->addChild(
                        $addNodeWithChildrenRecursively($childNode, $loadingDepth - 1)
                    );
                }
            }

            return $treeNodeBuilder;
        };

        $addNodeWithChildrenRecursively($node, $loadingDepth);
        return $this;
    }

    public function addNodeWithAncestors(Node $node, Nodes $ancestors): self
    {
        $treeNodeBuilder = $this->addNode($node);
        foreach ($ancestors as $parentNode) {
            $parentTreeNodeBuilder = $this->addNode($parentNode);
            $parentTreeNodeBuilder->addChild($treeNodeBuilder);
            $treeNodeBuilder = $parentTreeNodeBuilder;
        }

        return $this;
    }

    public function addNodeWithSiblingsAndAncestors(Node $node): self
    {
        $addNodeWithSiblingsAndParentRecursively = function (Node $node) use (&$addNodeWithSiblingsAndParentRecursively): TreeNodeBuilder {
            $treeNodeBuilder = $this->addNode($node);
            if ($parentNode = $this->nodeService->findParentNode($node)) {
                /** @var Node $parentNode */
                $parentTreeNodeBuilder = $addNodeWithSiblingsAndParentRecursively($parentNode);

                foreach ($this->nodeService->findPrecedingSiblingNodes($node) as $siblingNode) {
                    /** @var Node $siblingNode */
                    if ($this->nodeSearchSpecification->baseNodeTypeFilter->isSatisfiedByNode($siblingNode)) {
                        $siblingTreeNodeBuilder = $this->addNode($siblingNode);
                        $siblingTreeNodeBuilder->setHasUnloadedChildren(
                            $this->nodeService->getNumberOfChildNodes($siblingNode, $this->nodeSearchSpecification->baseNodeTypeFilter->nodeTypeCriteria) > 0,
                        );

                        $parentTreeNodeBuilder->addChild($siblingTreeNodeBuilder);
                    }
                }

                $parentTreeNodeBuilder->addChild($treeNodeBuilder);

                foreach ($this->nodeService->findSucceedingSiblingNodes($node) as $siblingNode) {
                    /** @var Node $siblingNode */
                    if ($this->nodeSearchSpecification->baseNodeTypeFilter->isSatisfiedByNode($siblingNode)) {
                        $siblingTreeNodeBuilder = $this->addNode($siblingNode);
                        $siblingTreeNodeBuilder->setHasUnloadedChildren(
                            $this->nodeService->getNumberOfChildNodes($siblingNode, $this->nodeSearchSpecification->baseNodeTypeFilter->nodeTypeCriteria) > 0,
                        );

                        $parentTreeNodeBuilder->addChild($siblingTreeNodeBuilder);
                    }
                }

                $parentTreeNodeBuilder->setHasUnloadedChildren(false);
            }

            return $treeNodeBuilder;
        };

        $leafTreeNodeBuilder = $addNodeWithSiblingsAndParentRecursively($node);
        $leafTreeNodeBuilder->setHasUnloadedChildren(
            $this->nodeService->getNumberOfChildNodes($node, $this->nodeSearchSpecification->baseNodeTypeFilter->nodeTypeCriteria) > 0,
        );

        return $this;
    }

    public function build(): TreeNode
    {
        return $this->rootTreeNodeBuilder->build();
    }

    private function addNode(Node $node): TreeNodeBuilder
    {
        $treeNodeBuilder = $this->treeNodeBuildersByNodeAggregateIdentifier[
            $node->aggregateId->value
        ] ??= $this->nodeService->createTreeNodeBuilderForNode($node);

        $treeNodeBuilder->setIsMatchedByFilter(
            $this->nodeSearchSpecification->isSatisfiedByNode($node)
        );

        $treeNodeBuilder->setIsLinkable(
            $this->linkableNodeSpecification->isSatisfiedByNode($node)
        );

        return $treeNodeBuilder;
    }
}
