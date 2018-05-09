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

use Neos\Flow\Annotations as Flow;
use Neos\Eel\FlowQuery\FlowQuery;
use Neos\Eel\FlowQuery\Operations\AbstractOperation;
use Neos\ContentRepository\Domain\Model\NodeInterface;

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
    protected static $priority = 100;

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
        $output = array();
        $outputNodePaths = array();

        $filter = isset($arguments[0]) ? $arguments[0] : null;

        /** @var NodeInterface $contextNode */
        foreach ($flowQuery->getContext() as $contextNode) {
            /** @var NodeInterface $childNode */
            foreach ($contextNode->getChildNodes($filter) as $childNode) {
                if (!isset($outputNodePaths[$childNode->getPath()])) {
                    $output[] = $childNode;
                    $outputNodePaths[$childNode->getPath()] = true;
                }
            }
        }
        $flowQuery->setContext($output);
    }
}
