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

use Neos\ContentRepository\Domain\Projection\Content\ContentSubgraphInterface;
use Neos\ContentRepository\Domain\Projection\Content\NodeInterface;
use Neos\ContentRepository\Domain\Projection\Content\TraversableNodeInterface;
use Neos\ContentRepository\Domain\Service\NodeTypeConstraintService;
use Neos\Eel\ProtectedContextAwareInterface;
use Neos\Flow\Annotations as Flow;
use Neos\Flow\Mvc\Controller\ControllerContext;
use Neos\Flow\Persistence\PersistenceManagerInterface;
use Neos\Neos\Domain\Context\Content\NodeAddress;
use Neos\Neos\Domain\Context\Content\NodeAddressFactory;
use Neos\Neos\Domain\Service\ContentContext;
use Neos\Neos\Service\LinkingService;
use Neos\Neos\Service\Mapping\NodePropertyConverterService;
use Neos\Neos\TypeConverter\EntityToIdentityConverter;
use Neos\Neos\Ui\Domain\Service\UserLocaleService;

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
     * @var NodeAddressFactory
     */
    protected $nodeAddressFactory;

    /**
     * @Flow\Inject
     * @var NodeTypeConstraintService
     */
    protected $nodeTypeConstraintService;

    /**
     * @param NodeInterface $node
     * @param ContentSubgraphInterface $subgraph
     * @param ControllerContext $controllerContext
     * @param bool $omitMostPropertiesForTreeState
     * @param string $baseNodeTypeOverride
     * @return array
     * @deprecated See methods with specific names for different behaviors
     */
    public function renderNode(NodeInterface $node, ContentSubgraphInterface $subgraph, ControllerContext $controllerContext = null, $omitMostPropertiesForTreeState = false, $baseNodeTypeOverride = null)
    {
        return ($omitMostPropertiesForTreeState ?
            $this->renderNodeWithMinimalPropertiesAndChildrenInformation($node, $subgraph, $controllerContext, $baseNodeTypeOverride) :
            $this->renderNodeWithPropertiesAndChildrenInformation($node, $subgraph, $controllerContext, $baseNodeTypeOverride)
        );
    }

    /**
     * @param NodeInterface $node
     * @param ContentSubgraphInterface $subgraph
     * @param ControllerContext|null $controllerContext
     * @param string $baseNodeTypeOverride
     * @return array
     */
    public function renderNodeWithMinimalPropertiesAndChildrenInformation(NodeInterface $node, ContentSubgraphInterface $subgraph, ControllerContext $controllerContext = null, string $baseNodeTypeOverride = null): array
    {
        $this->userLocaleService->switchToUILocale();

        $nodeInfo = $this->getBasicNodeInformation($node, $subgraph);
        $nodeInfo['properties'] = [
            // if we are only rendering the tree state, ensure _isHidden is sent to hidden nodes are correctly shown in the tree.
            '_hidden' => $node->isHidden(),
            // TODO implement
            //'_hiddenInIndex' => $node->isHiddenInIndex(),
            //'_hiddenBeforeDateTime' => $node->getHiddenBeforeDateTime() instanceof \DateTimeInterface,
            //'_hiddenAfterDateTime' => $node->getHiddenAfterDateTime() instanceof \DateTimeInterface,
        ];

        if ($controllerContext !== null) {
            $nodeInfo = array_merge($nodeInfo, $this->getUriInformation($node, $controllerContext));
        }

        $baseNodeType = $baseNodeTypeOverride ? $baseNodeTypeOverride : $this->baseNodeType;
        $nodeInfo['children'] = $this->renderChildrenInformation($node, $subgraph, $baseNodeType);

        $this->userLocaleService->switchToUILocale(true);

        return $nodeInfo;
    }

    /**
     * @param NodeInterface $node
     * @param ContentSubgraphInterface $subgraph
     * @param ControllerContext|null $controllerContext
     * @param string $baseNodeTypeOverride
     * @return array
     */
    public function renderNodeWithPropertiesAndChildrenInformation(NodeInterface $node, ContentSubgraphInterface $subgraph, ControllerContext $controllerContext = null, string $baseNodeTypeOverride = null): array
    {
        $this->userLocaleService->switchToUILocale();

        $nodeInfo = $this->getBasicNodeInformation($node, $subgraph);
        $nodeInfo['properties'] = $this->nodePropertyConverterService->getPropertiesArray($node);
        $nodeInfo['isFullyLoaded'] = true;

        if ($controllerContext !== null) {
            $nodeInfo = array_merge($nodeInfo, $this->getUriInformation($node, $controllerContext));
        }

        $baseNodeType = $baseNodeTypeOverride ? $baseNodeTypeOverride : $this->baseNodeType;
        $nodeInfo['children'] = $this->renderChildrenInformation($node, $subgraph, $baseNodeType);

        $this->userLocaleService->switchToUILocale(true);

        return $nodeInfo;
    }

    /**
     * Get the "uri" and "previewUri" for the given node
     *
     * @param NodeInterface $node
     * @param ControllerContext $controllerContext
     * @return array
     */
    protected function getUriInformation(NodeInterface $node, ControllerContext $controllerContext): array
    {
        $nodeInfo = [];
        if (!$node->getNodeType()->isOfType($this->documentNodeTypeRole)) {
            return $nodeInfo;
        }

        try {
            $nodeInfo['uri'] = $this->createRedirectToNode($controllerContext, $node);
        } catch (\Neos\Flow\Mvc\Routing\Exception\MissingActionNameException $exception) {
            // Unless there is a serious problem with routes there shouldn't be an exception ever.
            $nodeInfo['uri'] = '';
        }

        return $nodeInfo;
    }

    /**
     * Get the basic information about a node.
     *
     * @param NodeInterface $node
     * @param ContentSubgraphInterface $subgraph
     * @return array
     * @throws \Neos\Neos\Domain\Context\Content\Exception\NodeAddressCannotBeSerializedException
     */
    protected function getBasicNodeInformation(NodeInterface $node, ContentSubgraphInterface $subgraph): array
    {
        return [
            // contextPath == NodeAddress
            'contextPath' => $this->nodeAddressFactory->createFromNode($node)->serializeForUri(),
            'name' => $node->getNodeName()->jsonSerialize(),
            'identifier' => $node->getNodeIdentifier()->jsonSerialize(),
            'nodeType' => $node->getNodeType()->getName(),
            'label' => $node->getLabel(),
            'isAutoCreated' => self::isAutoCreated($node, $subgraph),
            'depth' => self::getDepth($node, $subgraph),
            'children' => [],
            // TODO: "matchescurrentdimensions"
            //'matchesCurrentDimensions' => ($node instanceof Node && $node->dimensionsAreMatchingTargetDimensionValues())
        ];
    }

    /**
     * Get information for all children of the given parent node.
     *
     * @param NodeInterface $node
     * @param string $baseNodeTypeName
     * @return array
     */
    protected function renderChildrenInformation(NodeInterface $node, ContentSubgraphInterface $subgraph, string $baseNodeTypeName): array
    {
        $documentChildNodes = $subgraph->findChildNodes($node->getNodeIdentifier(), $this->nodeTypeConstraintService->unserializeFilters($baseNodeTypeName));
        // child nodes for content tree, must not include those nodes filtered out by `baseNodeType`
        $contentChildNodes = $subgraph->findChildNodes($node->getNodeIdentifier(), $this->nodeTypeConstraintService->unserializeFilters('!' . $this->documentNodeTypeRole));
        $childNodes = array_merge($documentChildNodes, $contentChildNodes);

        $mapper = function (NodeInterface $childNode) {
            return [
                'contextPath' => $this->nodeAddressFactory->createFromNode($childNode)->serializeForUri(),
                'nodeType' => $childNode->getNodeType()->getName() // TODO: DUPLICATED; should NOT be needed!!!
            ];
        };

        return array_map($mapper, $childNodes);
    }

    /**
     * @param array $nodes
     * @param ContentSubgraphInterface $subgraph
     * @param ControllerContext $controllerContext
     * @param bool $omitMostPropertiesForTreeState
     * @return array
     */
    public function renderNodes(array $nodes, ContentSubgraphInterface $subgraph, ControllerContext $controllerContext, $omitMostPropertiesForTreeState = false): array
    {
        $methodName = $omitMostPropertiesForTreeState ? 'renderNodeWithMinimalPropertiesAndChildrenInformation' : 'renderNodeWithPropertiesAndChildrenInformation';
        $mapper = function (NodeInterface $node) use ($subgraph, $controllerContext, $methodName) {
            return $this->$methodName($node, $subgraph, $controllerContext);
        };

        return array_map($mapper, $nodes);
    }

    /**
     * @param array $nodes
     * @param ControllerContext $controllerContext
     * @return array
     */
    public function renderNodesWithParents(array $nodes, ContentSubgraphInterface $subgraph, ControllerContext $controllerContext): array
    {
        // For search operation we want to include all nodes, not respecting the "baseNodeType" setting
        $baseNodeTypeOverride = $this->documentNodeTypeRole;
        $renderedNodes = [];

        /** @var NodeInterface $node */
        foreach ($nodes as $node) {
            if (array_key_exists($node->getPath(), $renderedNodes)) {
                $renderedNodes[$node->getPath()]['matched'] = true;
            } elseif ($renderedNode = $this->renderNodeWithMinimalPropertiesAndChildrenInformation($node, $subgraph, $controllerContext, $baseNodeTypeOverride)) {
                $renderedNode['matched'] = true;
                $renderedNodes[$node->getPath()] = $renderedNode;
            } else {
                continue;
            }

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
                    $renderedParentNode = $this->renderNodeWithMinimalPropertiesAndChildrenInformation($parentNode, $subgraph, $controllerContext, $baseNodeTypeOverride);
                    $renderedParentNode['intermediate'] = true;
                    $renderedNodes[$parentNode->getPath()] = $renderedParentNode;
                }
                $parentNode = $parentNode->getParent();
            }
        }

        return array_values($renderedNodes);
    }

    /**
     * @param NodeInterface $documentNode
     * @param ControllerContext $controllerContext
     * @return array
     */
    public function renderDocumentNodeAndChildContent(NodeInterface $documentNode, ControllerContext $controllerContext)
    {
        return $this->renderNodeAndChildContent($documentNode, $controllerContext);
    }

    /**
     * @param NodeInterface $node
     * @param ContentSubgraphInterface $subgraph
     * @param ControllerContext $controllerContext
     * @return array
     */
    protected function renderNodeAndChildContent(NodeInterface $node, ContentSubgraphInterface $subgraph, ControllerContext $controllerContext)
    {
        $reducer = function ($nodes, $node) use ($subgraph, $controllerContext) {
            $nodes = array_merge($nodes, $this->renderNodeAndChildContent($node, $subgraph, $controllerContext));
            return $nodes;
        };

        return array_reduce($node->getChildNodes('!' . $this->documentNodeTypeRole), $reducer, [$node->getContextPath() => $this->renderNodeWithPropertiesAndChildrenInformation($node, $subgraph, $controllerContext)]);
    }

    /**
     * @param NodeInterface $site
     * @param NodeInterface $documentNode
     * @param ContentSubgraphInterface $subgraph
     * @param ControllerContext $controllerContext
     * @return array
     * @throws \Neos\Neos\Domain\Context\Content\Exception\NodeAddressCannotBeSerializedException
     */
    public function defaultNodesForBackend(NodeInterface $site, NodeInterface $documentNode, ContentSubgraphInterface $subgraph, ControllerContext $controllerContext): array
    {
        return [
            $this->nodeAddressFactory->createFromNode($site)->serializeForUri() => $this->renderNodeWithPropertiesAndChildrenInformation($site, $subgraph, $controllerContext),
            $this->nodeAddressFactory->createFromNode($documentNode)->serializeForUri() => $this->renderNodeWithPropertiesAndChildrenInformation($documentNode, $subgraph, $controllerContext)
        ];
    }

    /**
     * @param ControllerContext $controllerContext
     * @param NodeInterface $node
     * @return string
     * @throws \Neos\Flow\Mvc\Routing\Exception\MissingActionNameException
     */
    public function createRedirectToNode(ControllerContext $controllerContext, NodeInterface $node = null)
    {
        if ($node === null) {
            return '';
        }

        $basicRedirectUrl = $controllerContext->getUriBuilder()
            ->reset()
            ->setCreateAbsoluteUri(true)
            ->setFormat('html')
            ->uriFor('redirectTo', [], 'Backend', 'Neos.Neos.Ui');

        $basicRedirectUrl .= '?' . http_build_query(['node' => $this->nodeAddressFactory->createFromNode($node)->serializeForUri()]);
        return $basicRedirectUrl;
    }

    /**
     * @param NodeInterface $node
     * @param ControllerContext $controllerContext
     * @return string
     * @throws \Neos\Neos\Exception
     */
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

    public function nodeAddress(NodeInterface $node)
    {
        return $this->nodeAddressFactory->createFromNode($node);
    }

    public function inBackend(NodeInterface $node)
    {
        return !$this->nodeAddressFactory->createFromNode($node)->isInLiveWorkspace();
    }
}
