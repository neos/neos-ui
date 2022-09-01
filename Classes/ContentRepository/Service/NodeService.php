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


use Neos\ContentRepository\Core\Factory\ContentRepositoryId;
use Neos\ContentRepository\Core\Projection\ContentGraph\Node;
use Neos\Neos\FrontendRouting\NodeAddressFactory;
use Neos\ContentRepository\Core\Projection\ContentGraph\VisibilityConstraints;
use Neos\ContentRepositoryRegistry\ContentRepositoryRegistry;
use Neos\Flow\Annotations as Flow;

/**
 * @Flow\Scope("singleton")
 */
class NodeService
{
    /**
     * @Flow\Inject
     * @var ContentRepositoryRegistry
     */
    protected $contentRepositoryRegistry;

    /**
     * Helper method to retrieve the closest document for a node
     */
    public function getClosestDocument(Node $node): ?Node
    {
        if ($node->nodeType->isOfType('Neos.Neos:Document')) {
            return $node;
        }

        $subgraph = $this->contentRepositoryRegistry->subgraphForNode($node);

        while ($node instanceof Node) {
            if ($node->nodeType->isOfType('Neos.Neos:Document')) {
                return $node;
            }
            $node = $subgraph->findParentNode($node->nodeAggregateId);
        }

        return null;
    }

    /**
     * Helper method to check if a given node is a document node.
     *
     * @param  Node $node The node to check
     * @return boolean             A boolean which indicates if the given node is a document node.
     */
    public function isDocument(Node $node): bool
    {
        return ($this->getClosestDocument($node) === $node);
    }

    /**
     * Converts a given context path to a node object
     */
    public function getNodeFromContextPath(string $contextPath, ContentRepositoryId $contentRepositoryId): ?Node
    {
        $contentRepository = $this->contentRepositoryRegistry->get($contentRepositoryId);
        $nodeAddress = NodeAddressFactory::create($contentRepository)->createFromUriString($contextPath);

        $subgraph = $contentRepository->getContentGraph()->getSubgraph(
            $nodeAddress->contentStreamId,
            $nodeAddress->dimensionSpacePoint,
            VisibilityConstraints::withoutRestrictions()
        );
        return $subgraph->findNodeById($nodeAddress->nodeAggregateId);
    }
}
