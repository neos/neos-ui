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

use Neos\ContentRepository\Core\Projection\ContentGraph\Filter\FindDescendantNodesFilter;
use Neos\ContentRepository\Core\Projection\ContentGraph\Node;
use Neos\ContentRepository\Core\SharedModel\Node\NodeAggregateId;
use Neos\ContentRepositoryRegistry\ContentRepositoryRegistry;
use Neos\Eel\FlowQuery\FlowQuery;
use Neos\Eel\FlowQuery\Operations\AbstractOperation;
use Neos\Flow\Annotations as Flow;

/**
 * Custom search operation using the Content Graph fulltext search
 *
 * Original implementation: \Neos\Neos\Ui\FlowQueryOperations\SearchOperation
 * @internal
 */
class SearchOperation extends AbstractOperation
{
    /**
     * {@inheritdoc}
     *
     * @var string
     */
    protected static $shortName = 'search';

    /**
     * {@inheritdoc}
     *
     * @var integer
     */
    protected static $priority = 100;

    /**
     * @Flow\Inject
     * @var ContentRepositoryRegistry
     */
    protected $contentRepositoryRegistry;

    /**
     * {@inheritdoc}
     *
     * We can only handle ContentRepository Nodes.
     *
     * @param mixed $context
     * @return boolean
     */
    public function canEvaluate($context)
    {
        return (isset($context[0]) && ($context[0] instanceof Node));
    }

    /**
     * {@inheritdoc}
     *
     * @param FlowQuery<int,mixed> $flowQuery the FlowQuery object
     * @param array<int,mixed> $arguments the arguments for this operation
     */
    public function evaluate(FlowQuery $flowQuery, array $arguments): void
    {
        /** @var array<int,mixed> $context */
        $context = $flowQuery->getContext();
        /** @var Node $contextNode */
        $contextNode = $context[0];
        $subgraph = $this->contentRepositoryRegistry->subgraphForNode($contextNode);
        $matchingNodeByAggregateId = null;
        $filter = FindDescendantNodesFilter::create();
        if (isset($arguments[0]) && $arguments[0] !== '') {
            if ($nodeAggregateId = NodeAggregateId::tryFromString($arguments[0])) {
                $matchingNodeByAggregateId = $subgraph->findNodeById($nodeAggregateId);
            }
            $filter = $filter->with(searchTerm: $arguments[0]);
        }
        if (isset($arguments[1]) && $arguments[1] !== '') {
            $filter = $filter->with(nodeTypes: $arguments[1]);
        }
        $nodes = iterator_to_array($subgraph->findDescendantNodes(
            $contextNode->aggregateId,
            $filter
        ));
        if ($matchingNodeByAggregateId !== null) {
            array_unshift($nodes, $matchingNodeByAggregateId);
        }
        $flowQuery->setContext($nodes);
    }
}
