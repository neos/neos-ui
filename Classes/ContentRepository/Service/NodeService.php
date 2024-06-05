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

use Neos\ContentRepository\Domain\Model\NodeInterface;
use Neos\ContentRepository\Domain\Model\Workspace;
use Neos\ContentRepository\Domain\Service\ContextFactoryInterface;
use Neos\ContentRepository\Domain\Utility\NodePaths;
use Neos\Eel\FlowQuery\FlowQuery;
use Neos\Error\Messages\Error;
use Neos\Flow\Annotations as Flow;
use Neos\Neos\Domain\Model\Domain;
use Neos\Neos\Domain\Model\Site;
use Neos\Neos\Domain\Repository\DomainRepository;
use Neos\Neos\Domain\Repository\SiteRepository;

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
     * @var SiteRepository
     */
    protected $siteRepository;

    /**
     * @Flow\Inject
     * @var DomainRepository
     */
    protected $domainRepository;

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
    public function getNodeFromContextPath($contextPath, Site $site = null, Domain $domain = null, $includeAll = false)
    {
        $nodePathAndContext = NodePaths::explodeContextPath($contextPath);
        $nodePath = $nodePathAndContext['nodePath'];
        $workspaceName = $nodePathAndContext['workspaceName'];
        $dimensions = $nodePathAndContext['dimensions'];

        $contextProperties = $this->prepareContextProperties($workspaceName, $dimensions);

        if ($site === null) {
            list(, , $siteNodeName) = explode('/', $nodePath);
            $site = $this->siteRepository->findOneByNodeName($siteNodeName);
        }

        if ($domain === null) {
            $domain = $this->domainRepository->findOneBySite($site);
        }

        $contextProperties['currentSite'] = $site;
        $contextProperties['currentDomain'] = $domain;
        if ($includeAll === true) {
            $contextProperties['invisibleContentShown'] = true;
            $contextProperties['removedContentShown'] = true;
            $contextProperties['inaccessibleContentShown'] = true;
        }

        $context = $this->contextFactory->create(
            $contextProperties
        );

        $workspace = $context->getWorkspace(false);
        if (!$workspace) {
            return new Error(
                sprintf('Could not convert the given source to Node object because the workspace "%s" as specified in the context node path does not exist.', $workspaceName),
                1451392329
            );
        }

        return $context->getNode($nodePath);
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
        return $this->getNodeInWorkspace($node, $workspace) !== null;
    }

    /**
     * Get the variant of the given node in the given workspace
     *
     * @param NodeInterface $node
     * @param Workspace $workspace
     * @return NodeInterface|null
     */
    public function getNodeInWorkspace(NodeInterface $node, Workspace $workspace): ?NodeInterface
    {
        $context = ['workspaceName' => $workspace->getName()];
        $flowQuery = new FlowQuery([$node]);

        $result = $flowQuery->context($context);
        if ($result->count() > 0) {
            return $result->get(0);
        } else {
            return null;
        }
    }

    /**
     * Prepares the context properties for the nodes based on the given workspace and dimensions
     *
     * @param string $workspaceName
     * @param array $dimensions
     * @return array
     */
    protected function prepareContextProperties($workspaceName, array $dimensions = null)
    {
        $contextProperties = [
            'workspaceName' => $workspaceName,
            'invisibleContentShown' => false,
            'removedContentShown' => false
        ];

        if ($workspaceName !== 'live') {
            $contextProperties['invisibleContentShown'] = true;
        }

        if ($dimensions !== null) {
            $contextProperties['dimensions'] = $dimensions;
        }

        return $contextProperties;
    }
}
