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

use Neos\ContentRepository\Domain\Projection\Content\ContentGraphInterface;
use Neos\ContentRepository\Domain\Projection\Content\NodeInterface;
use Neos\Error\Messages\Error;
use Neos\Flow\Annotations as Flow;
use Neos\Eel\FlowQuery\FlowQuery;
use Neos\ContentRepository\Domain\Model\Workspace;
use Neos\ContentRepository\Domain\Service\ContextFactoryInterface;
use Neos\Flow\Property\PropertyMapper;
use Neos\Neos\Domain\Context\Content\NodeAddressFactory;
use Neos\Neos\Domain\Projection\Domain\DomainFinder;
use Neos\Neos\Domain\Projection\Site\SiteFinder;

/**
 * @Flow\Scope("singleton")
 */
class NodeService
{
    /**
     * @Flow\Inject
     * @var ContextFactoryInterface
     */
    protected $contextFactory;

    /**
     * @Flow\Inject
     * @var SiteFinder
     */
    protected $siteFinder;

    /**
     * @Flow\Inject
     * @var DomainFinder
     */
    protected $domainFinder;

    /**
     * @Flow\Inject
     * @var PropertyMapper
     */
    protected $propertyMapper;

    /**
     * @Flow\Inject
     * @var ContentGraphInterface
     */
    protected $contentGraph;

    /**
     * @Flow\Inject
     * @var NodeAddressFactory
     */
    protected $nodeAddressFactory;

    /**
     * Helper method to retrieve the closest document for a node
     *
     * @param NodeInterface $node
     * @return NodeInterface
     */
    public function getClosestDocument(NodeInterface $node)
    {
        if ($node->getNodeType()->isOfType('Neos.Neos:Document')) {
            return $node;
        }

        $flowQuery = new FlowQuery([$node]);
        return $flowQuery->closest('[instanceof Neos.Neos:Document]')->get(0);
    }

    /**
     * Helper method to check if a given node is a document node.
     *
     * @param  NodeInterface $node The node to check
     * @return boolean             A boolean which indicates if the given node is a document node.
     */
    public function isDocument(NodeInterface $node)
    {
        return ($this->getClosestDocument($node) === $node);
    }

    /**
     * Converts a given context path to a node object
     *
     * @param string $contextPath
     * @return NodeInterface|Error
     */
    public function getNodeFromContextPath($contextPath)
    {
        $nodeAddress = $this->nodeAddressFactory->createFromUriString($contextPath);
        return $this->contentGraph
            ->getSubgraphByIdentifier($nodeAddress->getContentStreamIdentifier(), $nodeAddress->getDimensionSpacePoint())
            ->findNodeByNodeAggregateIdentifier($nodeAddress->getNodeAggregateIdentifier());
    }

    /**
     * Checks if the given node exists in the given workspace
     *
     * @param NodeInterface $node
     * @param Workspace $workspace
     * @return boolean
     */
    public function nodeExistsInWorkspace(NodeInterface $node, Workspace $workspace)
    {
        $context = ['workspaceName' => $workspace->getName()];
        $flowQuery = new FlowQuery([$node]);

        return $flowQuery->context($context)->count() > 0;
    }
}
