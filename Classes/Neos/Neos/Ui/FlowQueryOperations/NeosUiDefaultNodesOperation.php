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
        list($siteNode, $documentNode) = $flowQuery->getContext();
        // set default values for arguments
        list($baseNodeType, $loadingDepth, $toggledNodes) = array_replace([
            '',
            0,
            []
        ], $arguments);

        // Collect all parents of documentNode up to siteNode
        $parents = [];
        $currentNode = $documentNode->getParent();
        if ($currentNode) {
            $parentNodeIsUnderneathSiteNode = strpos($currentNode->getPath(), $siteNode->getPath()) === 0;
            while ($currentNode !== $siteNode && $parentNodeIsUnderneathSiteNode) {
                $parents[] = $currentNode->getContextPath();
                $currentNode = $currentNode->getParent();
            }
        }

        $nodes = [$siteNode];
        $gatherNodesRecursively = function (&$nodes, $baseNode, $level = 0) use (&$gatherNodesRecursively, $baseNodeType, $loadingDepth, $toggledNodes, $parents) {
            if (
                $level < $loadingDepth || // load all nodes within loadingDepth
                $loadingDepth === 0 || // unlimited loadingDepth
                in_array($baseNode->getContextPath(), $toggledNodes) || // load toggled nodes
                in_array($baseNode->getContextPath(), $parents) // load children of all parents of documentNode
            ) {
                foreach ($baseNode->getChildNodes($baseNodeType) as $childNode) {
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
