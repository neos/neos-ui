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
 * Renders nodes that are initially required by the user interface
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
        list($site, $documentNode) = $flowQuery->getContext();
        list($baseNodeType, $loadingDepth) = array_replace([
            '',
            0
        ], $arguments);

        $nodes = [];
        if ($site !== $documentNode) {
            $nodes[] = $site;
        }

        $gatherNodesRecursively = function (&$nodes, $baseNode, $level = 0) use (&$gatherNodesRecursively, $baseNodeType, $loadingDepth) {
            if ($level < $loadingDepth || $loadingDepth === 0) {
                foreach ($baseNode->getChildNodes($baseNodeType) as $childNode) {
                    $nodes[] = $childNode;
                    $gatherNodesRecursively($nodes, $childNode, $level + 1);
                }
            }
        };
        $gatherNodesRecursively($nodes, $site);

        $nodes[] = $documentNode;

        $flowQuery->setContext($nodes);
    }
}
