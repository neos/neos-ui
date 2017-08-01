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

use Neos\ContentRepository\Domain\Service\ContextFactory;
use Neos\ContentRepository\Domain\Service\NodeTypeManager;
use Neos\Eel\FlowQuery\FlowQuery;
use Neos\Eel\FlowQuery\Operations\AbstractOperation;
use Neos\Flow\Annotations as Flow;
use Neos\ContentRepository\Domain\Model\NodeInterface;
use Neos\Neos\Domain\Service\NodeSearchService;

/**
*/
class SearchOperation extends AbstractOperation
{
    /**
     * @Flow\Inject
     * @var NodeSearchService
     */
    protected $nodeSearchService;

    /**
     * @Flow\Inject
     * @var NodeTypeManager
     */
    protected $nodeTypeManager;

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
        $term = isset($arguments[0]) ? $arguments[0] : null;

        $nodeTypes = $this->nodeTypeManager->getSubNodeTypes('Neos.Neos:Document', false);
        /** @var NodeInterface $contextNode */
        $contextNode = $flowQuery->getContext()[0];
        $matchedNodes = $this->nodeSearchService->findByProperties($term, $nodeTypes, $contextNode->getContext(), $contextNode);
        $flowQuery->setContext($matchedNodes);
    }
}
