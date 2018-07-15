<?php

namespace Neos\Neos\Ui\Fusion\Helper;

/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

use Neos\ContentGraph\DoctrineDbalAdapter\Domain\Repository\ContentGraph;
use Neos\ContentGraph\DoctrineDbalAdapter\Domain\Repository\ContentSubgraph;
use Neos\ContentRepository\Domain\Projection\Content\ContentSubgraphInterface;
use Neos\ContentRepository\Domain\Projection\Content\NodeInterface;
use Neos\ContentRepository\Domain\Projection\Workspace\WorkspaceFinder;
use Neos\ContentRepository\Domain\Service\NodeTypeConstraintService;
use Neos\ContentRepository\Domain\ValueObject\NodeName;
use Neos\ContentRepository\Domain\ValueObject\NodeTypeName;
use Neos\Flow\Annotations as Flow;
use Neos\Eel\FlowQuery\FlowQuery;
use Neos\Eel\ProtectedContextAwareInterface;
use Neos\Flow\Mvc\Controller\ControllerContext;
use Neos\Flow\Persistence\PersistenceManagerInterface;
use Neos\Neos\Domain\Context\Content\NodeAddress;
use Neos\Neos\Domain\Context\Content\NodeAddressFactory;
use Neos\Neos\Domain\Projection\Site\SiteFinder;
use Neos\Neos\Service\Mapping\NodePropertyConverterService;
use Neos\Neos\Ui\Domain\Service\UserLocaleService;
use Neos\Neos\Domain\Service\ContentContext;
use Neos\Neos\Service\LinkingService;
use Neos\Neos\TypeConverter\EntityToIdentityConverter;

/**
 * @Flow\Scope("singleton")
 */
class NodeInfoHelper implements ProtectedContextAwareInterface
{
    /**
     * @Flow\Inject
     * @var UserLocaleService
     */
    protected $userLocaleService;

    /**
     * @Flow\Inject
     * @var LinkingService
     */
    protected $linkingService;

    /**
     * @Flow\Inject
     * @var EntityToIdentityConverter
     */
    protected $entityToIdentityConverter;

    /**
     * @Flow\Inject
     * @var PersistenceManagerInterface
     */
    protected $persistenceManager;

    /**
     * @Flow\Inject
     * @var NodePropertyConverterService
     */
    protected $nodePropertyConverterService;

    /**
     * @Flow\InjectConfiguration(path="userInterface.navigateComponent.nodeTree.presets.default.baseNodeType", package="Neos.Neos")
     * @var string
     */
    protected $baseNodeType;

    /**
     * @Flow\InjectConfiguration(path="userInterface.navigateComponent.nodeTree.loadingDepth", package="Neos.Neos")
     * @var string
     */
    protected $loadingDepth;

    /**
     * @Flow\InjectConfiguration(path="nodeTypeRoles.document", package="Neos.Neos.Ui")
     * @var string
     */
    protected $documentNodeTypeRole;

    /**
     * @Flow\Inject
     * @var NodeTypeConstraintService
     */
    protected $nodeTypeConstraintService;

    /**
     * @Flow\Inject
     * @var WorkspaceFinder
     */
    protected $workspaceFinder;


    /**
     * @Flow\Inject
     * @var ContentGraph
     */
    protected $contentGraph;

    /**
     * @Flow\Inject
     * @var SiteFinder
     */
    protected $siteFinder;


    /**
     * @Flow\Inject
     * @var NodeAddressFactory
     */
    protected $nodeAddressFactory;


    private static function getDepth(NodeInterface $node, ContentSubgraphInterface $subgraph)
    {
        // TODO: remove this method as it might be slow
        $path = $subgraph->findNodePath($node->getNodeIdentifier());
        return substr_count((string)$path, '/', 1);
    }

    private static function isAutoCreated(NodeInterface $node, ContentSubgraphInterface $subgraph)
    {
        $parent = $subgraph->findParentNode($node->getNodeIdentifier());
        if ($parent) {
            if (array_key_exists((string)$node->getNodeName(), $parent->getNodeType()->getAutoCreatedChildNodes())) {
                return true;
            }
        }
        return false;
    }

    /**
     * @param NodeInterface $node
     * @param ContentSubgraph $subgraph
     * @param ControllerContext $controllerContext
     * @param bool $omitMostPropertiesForTreeState
     * @param string $baseNodeTypeOverride
     * @return array
     * @throws \Neos\Eel\Exception
     */
    public function renderNode(NodeInterface $node, ContentSubgraphInterface $subgraph, ControllerContext $controllerContext = null, $omitMostPropertiesForTreeState = false, $baseNodeTypeOverride = null)
    {
        $this->userLocaleService->switchToUILocale();

        $baseNodeType = $baseNodeTypeOverride ? $baseNodeTypeOverride : $this->baseNodeType;
        $nodeInfo = [
            // contextPath == NodeAddress
            'contextPath' => $this->nodeAddressFactory->createFromNode($node)->serializeForUri(),
            'name' => (string)$node->getNodeName(),
            'identifier' => (string)$node->getNodeIdentifier(),
            'nodeType' => $node->getNodeType()->getName(),
            'properties' => $omitMostPropertiesForTreeState ? [
                // if we are only rendering the tree state, ensure _isHidden is sent to hidden nodes are correctly shown in the tree.
                '_hidden' => $node->isHidden()
            ] : $this->nodePropertyConverterService->getPropertiesArray($node),
            'label' => $node->getLabel(),
            'isAutoCreated' => self::isAutoCreated($node, $subgraph),
            'depth' => self::getDepth($node, $subgraph),
            'children' => [],
        ];
        // It's important to not set `isFullyLoaded` to false by default, so the state would get merged correctly
        if (!$omitMostPropertiesForTreeState) {
            $nodeInfo['isFullyLoaded'] = true;
        }
        if ($controllerContext !== null && $node->getNodeType()->isOfType($this->documentNodeTypeRole)) {
            $workspace = $this->workspaceFinder->findOneByCurrentContentStreamIdentifier($node->getContentStreamIdentifier());
            if ($workspace) {
                // TODO figure out current site, instead of just using default site!!
                $siteNode = $subgraph->findChildNodeConnectedThroughEdgeName($this->getRootNodeIdentifier(), new NodeName($this->siteFinder->findDefault()->nodeName));
                $nodeInfo['uri'] = $this->uri($this->nodeAddressFactory->createFromNode($node), $controllerContext);
            }

            // TODO
            /*
            $nodeInLiveWorkspace = new FlowQuery([$node]);
            $nodeInLiveWorkspace = $nodeInLiveWorkspace->context(['workspaceName' => 'live'])->get(0);

            if ($nodeInLiveWorkspace !== null) {
                $nodeInfo['previewUri'] = $this->uri($nodeInLiveWorkspace, $controllerContext);
            }
            */
        }

        // child nodes for document tree, respecting the `baseNodeType` filter
        $documentNodeTypeFilters = $this->nodeTypeConstraintService->unserializeFilters($baseNodeType);
        $documentChildNodes = $subgraph->findChildNodes($node->getNodeIdentifier(), $documentNodeTypeFilters);
        // child nodes for content tree, must not include those nodes filtered out by `baseNodeType`

        $contentNodeTypeFilters = $this->nodeTypeConstraintService->unserializeFilters('!' . $this->documentNodeTypeRole);
        $contentChildNodes = $subgraph->findChildNodes($node->getNodeIdentifier(), $contentNodeTypeFilters);
        $childNodes = array_merge($documentChildNodes, $contentChildNodes);

        foreach ($childNodes as $childNode) {
            /* @var NodeInterface $childNode */
            $nodeInfo['children'][] = [
                'contextPath' => $this->nodeAddressFactory->createFromNode($childNode)->serializeForUri(),
                'nodeType' => $childNode->getNodeType()->getName() // TODO: DUPLICATED; should NOT be needed!!!
            ];
        }
        $this->userLocaleService->switchToUILocale(true);

        return $nodeInfo;
    }

    protected function renderNodeToList(&$nodes, NodeInterface $node, ContentSubgraphInterface $subgraph, ControllerContext $controllerContext)
    {
        if ($nodeInfo = $this->renderNode($node, $subgraph, $controllerContext)) {
            $nodeAddress = $this->nodeAddressFactory->createFromNode($node)->serializeForUri();
            $nodes[$nodeAddress] = $nodeInfo;
        }
    }

    public function renderNodes(array $nodes, ContentSubgraphInterface $subgraph, ControllerContext $controllerContext, $omitMostPropertiesForTreeState = false)
    {
        $renderedNodes = [];
        foreach ($nodes as $node) {
            if ($nodeInfo = $this->renderNode($node, $subgraph, $controllerContext, $omitMostPropertiesForTreeState)) {
                $renderedNodes[] = $nodeInfo;
            }
        }
        return $renderedNodes;
    }

    /**
     * @param array $nodes
     * @param ContentSubgraphInterface $subgraph
     * @param ControllerContext $controllerContext
     * @return array
     * @throws \Neos\Eel\Exception
     */
    public function renderNodesWithParents(array $nodes, ContentSubgraphInterface $subgraph, ControllerContext $controllerContext): array
    {
        // For search operation we want to include all nodes, not respecting the "baseNodeType" setting
        $baseNodeTypeOverride = $this->documentNodeTypeRole;
        $renderedNodes = [];

        /** @var NodeInterface $node */
        foreach ($nodes as $node) {
            $nodePathString = $subgraph->findNodePath($node);
            if (array_key_exists($nodePathString, $renderedNodes)) {
                $renderedNodes[$nodePathString]['matched'] = true;
            } elseif ($renderedNode = $this->renderNode($node, $subgraph, $controllerContext, true, $baseNodeTypeOverride)) {
                $renderedNode['matched'] = true;
                $renderedNodes[$nodePathString] = $renderedNode;
            } else {
                continue;
            }

            // TODO: the code below looks ugly and will break!!
            /* @var $contentContext ContentContext */
            $contentContext = $node->getContext();
            $siteNodePath = $contentContext->getCurrentSiteNode()->getPath();
            $parentNode = $node->getParent();

            // we additionally need to check that our parent nodes are underneath the site node; otherwise it might happen that
            // we try to send the "/sites" node to the UI (which we cannot do, because this does not have an URL)
            $parentNodeIsUnderneathSiteNode = (strpos($parentNode->getPath(), $siteNodePath) === 0);
            while ($parentNode->getNodeType()->isOfType($baseNodeTypeOverride) && $parentNodeIsUnderneathSiteNode) {
                if (array_key_exists($parentNode->getPath(), $renderedNodes)) {
                    $renderedNodes[$parentNode->getPath()]['intermediate'] = true;
                } else {
                    $renderedParentNode = $this->renderNode($parentNode, $controllerContext, true, $baseNodeTypeOverride);
                    $renderedParentNode['intermediate'] = true;
                    $renderedNodes[$parentNode->getPath()] = $renderedParentNode;
                }
                $parentNode = $parentNode->getParent();
            }
        }

        return array_values($renderedNodes);
    }

    public function renderDocumentNodeAndChildContent(NodeInterface $documentNode, ControllerContext $controllerContext)
    {
        $nodes = [];
        $this->renderDocumentNodeAndChildContentInternal($nodes, $documentNode, $controllerContext);
        return $nodes;
    }

    protected function renderDocumentNodeAndChildContentInternal(array &$nodes, NodeInterface $node, ControllerContext $controllerContext)
    {
        $this->renderNodeToList($nodes, $node, $controllerContext);
        foreach ($node->getChildNodes('!' . $this->documentNodeTypeRole) as $childNode) {
            $this->renderDocumentNodeAndChildContentInternal($nodes, $childNode, $controllerContext);
        }
    }

    public function defaultNodesForBackend(NodeInterface $site, NodeInterface $documentNode, ContentSubgraphInterface $subgraph, ControllerContext $controllerContext)
    {
        $result = [];
        $this->renderNodeToList($result, $site, $subgraph, $controllerContext);
        $this->renderNodeToList($result, $documentNode, $subgraph, $controllerContext);

        return $result;
    }

    public function nodeAddress(NodeInterface $node)
    {
        return $this->nodeAddressFactory->createFromNode($node);
    }

    public function uri(NodeAddress $nodeAddress = null, ControllerContext $controllerContext)
    {
        if ($nodeAddress === null) {
            // This happens when the document node os not published yet
            return '';
        }
        $request = $controllerContext->getRequest()->getMainRequest();

        $uriBuilder = clone $controllerContext->getUriBuilder();
        $uriBuilder->setRequest($request);
        $uri = $uriBuilder
            ->reset()
            ->setFormat('html')
            ->setCreateAbsoluteUri(true)
            ->uriFor('show', array('node' => $nodeAddress), 'Frontend\Node', 'Neos.Neos');
        return $uri;
    }

    /**
     * @param string $methodName
     * @return boolean
     */
    public function allowsCallOfMethod($methodName)
    {
        return true;
    }

    public function serializedNodeAddress(NodeInterface $node): string
    {
        return $this->nodeAddressFactory->createFromNode($node)->serializeForUri();
    }

    /**
     * @return \Neos\ContentRepository\Domain\ValueObject\NodeIdentifier
     * @throws \Doctrine\DBAL\DBALException
     * @throws \Exception
     */
    protected function getRootNodeIdentifier(): \Neos\ContentRepository\Domain\ValueObject\NodeIdentifier
    {
        return $this->contentGraph->findRootNodeByType(new NodeTypeName('Neos.Neos:Sites'))->getNodeIdentifier();
    }


    public function inBackend(NodeInterface $node)
    {
        return !$this->nodeAddressFactory->createFromNode($node)->isInLiveWorkspace();
    }

}
