<?php
namespace Neos\Neos\Ui\FlowQueryOperations;

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
use Neos\ContentRepository\Domain\Service\NodeTypeConstraintService;
use Neos\Flow\Annotations as Flow;
use Neos\Eel\FlowQuery\FlowQuery;
use Neos\Eel\FlowQuery\Operations\AbstractOperation;

/**
 * Fetches all nodes needed for the given state of the UI
 */
class NeosUiDefaultNodesOperation extends AbstractOperation
{
    /**
     * {@inheritdoc}
     *
     * @var string
     */
    protected static $shortName = 'neosUiDefaultNodes';

    /**
     * {@inheritdoc}
     *
     * @var integer
     */
    protected static $priority = 100;

    /**
     * @Flow\Inject
     * @var ContentGraphInterface
     */
    protected $contentGraph;

    /**
     * @Flow\Inject
     * @var NodeTypeConstraintService
     */
    protected $nodeTypeConstraintsService;

    /**
     * {@inheritdoc}
     *
     * @param array (or array-like object) $context onto which this operation should be applied
     * @return boolean TRUE if the operation can be applied onto the $context, FALSE otherwise
     */
    public function canEvaluate($context)
    {
        return isset($context[0]) && ($context[0] instanceof NodeInterface);
    }

    /**
     * {@inheritdoc}
     *
     * @param FlowQuery $flowQuery the FlowQuery object
     * @param array $arguments the arguments for this operation
     * @return void
     */
    public function evaluate(FlowQuery $flowQuery, array $arguments)
    {
        /* @var $documentNode \Neos\ContentRepository\Domain\Projection\Content\NodeInterface */
        list($siteNode, $documentNode) = $flowQuery->getContext();
        list($baseNodeType, $loadingDepth, $toggledNodes) = $arguments;

        $baseNodeTypeConstraints = $this->nodeTypeConstraintsService->unserializeFilters($baseNodeType);


        // Collect all parents of documentNode up to siteNode
        $parents = [];
        $subgraph = $this->contentGraph->getSubgraphByIdentifier($documentNode->getContentStreamIdentifier(), $documentNode->getDimensionSpacePoint());
        $currentNode = $subgraph->findParentNodeByNodeAggregateIdentifier($documentNode->getNodeAggregateIdentifier());
        if ($currentNode) {
            while ($currentNode !== $siteNode && $currentNode !== null) {
                $parents[] = $currentNode->getNodeAggregateIdentifier();
                $currentNode = $subgraph->findParentNodeByNodeAggregateIdentifier($currentNode->getNodeAggregateIdentifier());
            }
        }

        $nodes = [$siteNode];
        $gatherNodesRecursively = function (&$nodes, NodeInterface $baseNode, $level = 0) use (&$gatherNodesRecursively, $baseNodeTypeConstraints, $loadingDepth, $toggledNodes, $parents, $subgraph) {
            if (
                $level < $loadingDepth || // load all nodes within loadingDepth
                $loadingDepth === 0 || // unlimited loadingDepth
                in_array($baseNode->getNodeAggregateIdentifier(), $toggledNodes) || // load toggled nodes
                in_array($baseNode->getNodeAggregateIdentifier(), $parents) // load children of all parents of documentNode
            ) {
                foreach ($subgraph->findChildNodes($baseNode->getNodeIdentifier(), $baseNodeTypeConstraints) as $childNode) {
                    $nodes[] = $childNode;
                    $gatherNodesRecursively($nodes, $childNode, $level + 1);
                }
            }
        };
        $gatherNodesRecursively($nodes, $siteNode);

        if (!in_array($documentNode, $nodes)) {
            $nodes[] = $documentNode;
        }

        $flowQuery->setContext($nodes);
    }
}
