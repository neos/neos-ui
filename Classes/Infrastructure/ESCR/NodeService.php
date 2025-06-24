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

namespace Neos\Neos\Ui\Infrastructure\ESCR;

use Neos\ContentRepository\Core\ContentRepository;
use Neos\ContentRepository\Core\NodeType\NodeType;
use Neos\ContentRepository\Core\NodeType\NodeTypeName;
use Neos\ContentRepository\Core\Projection\ContentGraph\AbsoluteNodePath;
use Neos\ContentRepository\Core\Projection\ContentGraph\ContentSubgraphInterface;
use Neos\ContentRepository\Core\Projection\ContentGraph\Filter\CountChildNodesFilter;
use Neos\ContentRepository\Core\Projection\ContentGraph\Filter\FindAncestorNodesFilter;
use Neos\ContentRepository\Core\Projection\ContentGraph\Filter\FindChildNodesFilter;
use Neos\ContentRepository\Core\Projection\ContentGraph\Filter\FindDescendantNodesFilter;
use Neos\ContentRepository\Core\Projection\ContentGraph\Filter\FindPrecedingSiblingNodesFilter;
use Neos\ContentRepository\Core\Projection\ContentGraph\Filter\FindSucceedingSiblingNodesFilter;
use Neos\ContentRepository\Core\Projection\ContentGraph\Filter\NodeType\NodeTypeCriteria;
use Neos\ContentRepository\Core\Projection\ContentGraph\Node;
use Neos\ContentRepository\Core\Projection\ContentGraph\Nodes;
use Neos\ContentRepository\Core\SharedModel\Node\NodeAddress;
use Neos\ContentRepository\Core\SharedModel\Node\NodeAggregateId;
use Neos\Flow\Annotations as Flow;
use Neos\Neos\Domain\NodeLabel\NodeLabelGeneratorInterface;
use Neos\Neos\Domain\SubtreeTagging\NeosSubtreeTag;
use Neos\Neos\PendingChangesProjection\Changes;
use Neos\Neos\Ui\Application\Shared\NodeTypeWasNotFound;
use Neos\Neos\Ui\Application\Shared\NodeWasNotFound;
use Neos\Neos\Ui\Application\Shared\TreeNodeBuilder;
use Neos\Workspace\Ui\ViewModel\PendingChanges;

/**
 * @internal
 */
#[Flow\Proxy(false)]
final class NodeService
{
    public function __construct(
        private readonly ContentRepository $contentRepository,
        public readonly ContentSubgraphInterface $subgraph,
        private readonly NodeLabelGeneratorInterface $nodeLabelGenerator,
        public readonly NodeChangeStateCollection $pendingChanges,
    ) {
    }

    public function requireNodeById(NodeAggregateId $nodeAggregateId): Node
    {
        $node = $this->findNodeById($nodeAggregateId);
        if ($node === null) {
            throw NodeWasNotFound::becauseNodeWithGivenIdentifierDoesNotExistInCurrentSubgraph(
                nodeAggregateId: $nodeAggregateId,
                subgraph: $this->subgraph,
            );
        }

        return $node;
    }

    public function findNodeById(NodeAggregateId $nodeAggregateId): ?Node
    {
        return $this->subgraph->findNodeById($nodeAggregateId);
    }

    public function requireNodeTypeByName(NodeTypeName $nodeTypeName): NodeType
    {
        $nodeType = $this->contentRepository->getNodeTypeManager()->getNodeType($nodeTypeName);
        if ($nodeType === null) {
            throw NodeTypeWasNotFound::becauseNodeTypeWithGivenNameDoesNotExistInCurrentSchema(
                nodeTypeName: $nodeTypeName,
                contentRepositoryId: $this->contentRepository->id,
            );
        }

        return $nodeType;
    }

    public function getLabelForNode(Node $node): string
    {
        return $this->nodeLabelGenerator->getLabel($node);
    }

    public function findParentNode(Node $node): ?Node
    {
        $parent = $this->subgraph->findParentNode($node->aggregateId);
        return $parent && $this->filterRemovedNodes($parent) ? $parent : null;
    }

    public function findPrecedingSiblingNodes(Node $node): Nodes
    {
        $filter = FindPrecedingSiblingNodesFilter::create();

        return $this->subgraph->findPrecedingSiblingNodes($node->aggregateId, $filter)
                              ->filter(fn (Node $node) => $this->filterRemovedNodes($node));
    }

    public function findSucceedingSiblingNodes(Node $node): Nodes
    {
        $filter = FindSucceedingSiblingNodesFilter::create();

        return $this->subgraph->findSucceedingSiblingNodes($node->aggregateId, $filter)
                              ->filter(fn (Node $node) => $this->filterRemovedNodes($node));
    }

    public function findNodeByAbsoluteNodePath(AbsoluteNodePath $path): ?Node
    {
        $node = $this->subgraph->findNodeByAbsolutePath($path);
        return $node && $this->filterRemovedNodes($node) ? $node : null;
    }

    public function search(Node $rootNode, string $searchTerm, NodeTypeFilter $nodeTypeFilter): Nodes
    {
        $filter = FindDescendantNodesFilter::create(
            nodeTypes: $nodeTypeFilter->nodeTypeCriteria,
            searchTerm: $searchTerm
        );

        return $this->subgraph->findDescendantNodes($rootNode->aggregateId, $filter)
                              ->filter(fn (Node $node) => $this->filterRemovedNodes($node));
    }

    public function createTreeBuilderForRootNode(
        Node $rootNode,
        NodeSearchSpecification $nodeSearchSpecification,
    ): TreeBuilder {
        return new TreeBuilder(
            rootNode: $rootNode,
            nodeService: $this,
            rootTreeNodeBuilder: $this->createTreeNodeBuilderForNode($rootNode),
            nodeSearchSpecification: $nodeSearchSpecification,
        );
    }

    public function createTreeNodeBuilderForNode(Node $node): TreeNodeBuilder
    {
        $nodeType = $this->requireNodeTypeByName($node->nodeTypeName);
        $pendingChange = $this->pendingChanges->findByNodeAggreqateId($node->aggregateId);

        return new TreeNodeBuilder(
            nodeAddress: NodeAddress::fromNode($node),
            icon: $nodeType->getConfiguration('ui.icon') ?? 'questionmark',
            label: $this->getLabelForNode($node),
            nodeTypeLabel: $nodeType->getLabel(),
            isMatchedByFilter: false,
            isDisabled: $node->tags->withoutInherited()->contain(NeosSubtreeTag::disabled()),
            isHiddenInMenu: $node->getProperty('hiddenInMenu') ?? false,
            hasScheduledDisabledState:
                $node->getProperty('enableAfterDateTime') instanceof \DateTimeInterface
                || $node->getProperty('disableAfterDateTime') instanceof \DateTimeInterface,
            hasUnloadedChildren: false,
            isCreated: $pendingChange ? $pendingChange->isCreated : false,
            isModified: $pendingChange ? $pendingChange->isChanged : false,
            isRemoved: $pendingChange ? $pendingChange->isDeleted : false,
        );
    }

    public function findChildNodes(Node $parentNode, NodeTypeCriteria $nodeTypeCriteria): Nodes
    {
        $filter = FindChildNodesFilter::create(
            nodeTypes: $nodeTypeCriteria,
        );

        return $this->subgraph->findChildNodes($parentNode->aggregateId, $filter)
                              ->filter(fn (Node $node) => $this->filterRemovedNodes($node));
    }

    public function getNumberOfChildNodes(Node $parentNode, NodeTypeCriteria $nodeTypeCriteria): int
    {
        $filter = CountChildNodesFilter::create(
            nodeTypes: $nodeTypeCriteria,
        );

        return $this->subgraph->countChildNodes($parentNode->aggregateId, $filter);
    }

    public function findAncestorNodes(Node $node): Nodes
    {
        $filter = FindAncestorNodesFilter::create();

        return $this->subgraph->findAncestorNodes($node->aggregateId, $filter);
    }

    /**
     * Filter function to remove all nodes that are tagged as removed
     *    AND do not have the tag assigned directly (deleted as children)
     *    AND are not in the current changes (other workspaces)
     */
    public function filterRemovedNodes(Node $node): bool
    {
        if (!$node->tags->contain(NeosSubtreeTag::removed())) {
            return true;
        }
        if ($node->tags->withoutInherited()->contain(NeosSubtreeTag::removed())) {
            $changeState = $this->pendingChanges->findByNodeAggreqateId($node->aggregateId);
            if ($changeState instanceof NodeChangeState && $changeState->isDeleted) {
                return true;
            }
        }
        return false;
    }
}
