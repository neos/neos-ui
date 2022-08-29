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

use Neos\ContentRepository\Core\Projection\ContentGraph\Node;
use Neos\ContentRepository\Core\SharedModel\NodeType\NodeTypeConstraintParser;
use Neos\ContentRepository\Core\SharedModel\NodeType\NodeTypeConstraints;
use Neos\ContentRepositoryRegistry\ContentRepositoryRegistry;
use Neos\Eel\FlowQuery\FlowQuery;
use Neos\Eel\FlowQuery\Operations\AbstractOperation;
use Neos\Flow\Annotations as Flow;

/**
 * "children" operation working on ContentRepository nodes. It iterates over all
 * context elements and returns all child nodes or only those matching
 * the filter expression specified as optional argument.
 */
class NeosUiFilteredChildrenOperation extends AbstractOperation
{
    /**
     * {@inheritdoc}
     *
     * @var string
     */
    protected static $shortName = 'neosUiFilteredChildren';

    /**
     * {@inheritdoc}
     *
     * @var integer
     */
    protected static $priority = 500;

    /**
     * @Flow\Inject
     * @var ContentRepositoryRegistry
     */
    protected $contentRepositoryRegistry;

    /**
     * {@inheritdoc}
     *
     * @param array<int,mixed> $context (or array-like object) onto which this operation should be applied
     * @return boolean TRUE if the operation can be applied onto the $context, FALSE otherwise
     */
    public function canEvaluate($context)
    {
        return isset($context[0]) && ($context[0] instanceof Node);
    }

    /**
     * {@inheritdoc}
     *
     * @param FlowQuery<int,mixed> $flowQuery the FlowQuery object
     * @param array<int,mixed> $arguments the arguments for this operation
     * @return void
     */
    public function evaluate(FlowQuery $flowQuery, array $arguments)
    {
        $output = [];
        $outputNodeIdentifiers = [];

        $filter = isset($arguments[0]) ? $arguments[0] : null;

        /** @var Node $contextNode */
        foreach ($flowQuery->getContext() as $contextNode) {
            $subgraph = $this->contentRepositoryRegistry->subgraphForNode($contextNode);

            $contentRepository = $this->contentRepositoryRegistry->get($contextNode->subgraphIdentity->contentRepositoryIdentifier);
            foreach ($subgraph->findChildNodes(
                $contextNode->nodeAggregateIdentifier,
                NodeTypeConstraints::fromFilterString($filter)
            ) as $childNode) {
                if (!isset($outputNodeIdentifiers[(string)$childNode->nodeAggregateIdentifier])) {
                    $output[] = $childNode;
                    $outputNodeIdentifiers[(string)$childNode->nodeAggregateIdentifier] = true;
                }
            }
        }
        $flowQuery->setContext($output);
    }
}
