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

use Neos\ContentRepository\Domain\Model\Node;
use Neos\ContentRepository\Domain\Model\NodeInterface;
use Neos\Eel\FlowQuery\FlowQuery;
use Neos\Eel\ProtectedContextAwareInterface;
use Neos\Flow\Annotations as Flow;
use Neos\Flow\Mvc\Controller\ControllerContext;
use Neos\Flow\Persistence\PersistenceManagerInterface;
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
     * @param NodeInterface $node
     * @param ControllerContext $controllerContext
     * @param bool $omitMostPropertiesForTreeState
     * @param string $baseNodeTypeOverride
     * @return array
     */
    public function renderNode(NodeInterface $node, ControllerContext $controllerContext = null, $omitMostPropertiesForTreeState = false, $baseNodeTypeOverride = null)
    {
        $this->userLocaleService->switchToUILocale();

        $baseNodeType = $baseNodeTypeOverride ? $baseNodeTypeOverride : $this->baseNodeType;
        $nodeInfo = [
            'contextPath' => $node->getContextPath(),
            'name' => $node->getName(),
            'identifier' => $node->getIdentifier(),
            'nodeType' => $node->getNodeType()->getName(),
            'properties' => $omitMostPropertiesForTreeState ? [
                // if we are only rendering the tree state, ensure _isHidden is sent to hidden nodes are correctly shown in the tree.
                '_hidden' => $node->isHidden()
            ] : $this->nodePropertyConverterService->getPropertiesArray($node),
            'label' => $node->getLabel(),
            'isAutoCreated' => $node->isAutoCreated(),
            'depth' => $node->getDepth(),
            // TODO: 'uri' =>@if.onyRenderWhenNodeIsADocument = ${q(node).is('[instanceof Neos.Neos:Document]')}
            'children' => [],
            'matchesCurrentDimensions' => $node instanceof Node && $node->dimensionsAreMatchingTargetDimensionValues(),
        ];

        // It's important to not set `isFullyLoaded` to false by default, so the state would get merged correctly
        if (!$omitMostPropertiesForTreeState) {
            $nodeInfo['isFullyLoaded'] = true;
        }
        if ($controllerContext !== null && $node->getNodeType()->isOfType($this->documentNodeTypeRole)) {
            $nodeInfo['uri'] = $this->uri($node, $controllerContext);

            $nodeInLiveWorkspace = new FlowQuery([$node]);
            $nodeInLiveWorkspace = $nodeInLiveWorkspace->context(['workspaceName' => 'live'])->get(0);

            if ($nodeInLiveWorkspace !== null) {
                $nodeInfo['previewUri'] = $this->uri($nodeInLiveWorkspace, $controllerContext);
            }
        }

        // child nodes for document tree, respecting the `baseNodeType` filter
        $documentChildNodes = $node->getChildNodes($baseNodeType);
        // child nodes for content tree, must not include those nodes filtered out by `baseNodeType`
        $contentChildNodes = $node->getChildNodes('!' . $this->documentNodeTypeRole);
        $childNodes = array_merge($documentChildNodes, $contentChildNodes);

        foreach ($childNodes as $childNode) {
            /* @var NodeInterface $childNode */
            $nodeInfo['children'][] = [
                'contextPath' => $childNode->getContextPath(),
                'nodeType' => $childNode->getNodeType()->getName() // TODO: DUPLICATED; should NOT be needed!!!
            ];
        }
        $this->userLocaleService->switchToUILocale(true);

        return $nodeInfo;
    }

    protected function renderNodeToList(&$nodes, NodeInterface $node, ControllerContext $controllerContext)
    {
        if ($nodeInfo = $this->renderNode($node, $controllerContext)) {
            $nodes[$node->getContextPath()] = $nodeInfo;
        }
    }

    public function renderNodes(array $nodes, ControllerContext $controllerContext, $omitMostPropertiesForTreeState = false)
    {
        $renderedNodes = [];
        foreach ($nodes as $node) {
            if ($nodeInfo = $this->renderNode($node, $controllerContext, $omitMostPropertiesForTreeState)) {
                $renderedNodes[] = $nodeInfo;
            }
        }

        return $renderedNodes;
    }

    /**
     * @param array $nodes
     * @param ControllerContext $controllerContext
     * @return array
     */
    public function renderNodesWithParents(array $nodes, ControllerContext $controllerContext): array
    {
        // For search operation we want to include all nodes, not respecting the "baseNodeType" setting
        $baseNodeTypeOverride = $this->documentNodeTypeRole;
        $renderedNodes = [];

        /** @var NodeInterface $node */
        foreach ($nodes as $node) {
            if (array_key_exists($node->getPath(), $renderedNodes)) {
                $renderedNodes[$node->getPath()]['matched'] = true;
            } elseif ($renderedNode = $this->renderNode($node, $controllerContext, true, $baseNodeTypeOverride)) {
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

    public function defaultNodesForBackend(NodeInterface $site, NodeInterface $documentNode, ControllerContext $controllerContext)
    {
        $result = [];
        $this->renderNodeToList($result, $site, $controllerContext);
        $this->renderNodeToList($result, $documentNode, $controllerContext);

        return $result;
    }

    public function uri(NodeInterface $node = null, ControllerContext $controllerContext)
    {
        if ($node === null) {
            // This happens when the document node os not published yet
            return '';
        }

        // Create an absolute URI without resolving shortcuts
        return $this->linkingService->createNodeUri($controllerContext, $node, null, null, true, [], '', false, [], false);
    }

    /**
     * @param string $methodName
     * @return boolean
     */
    public function allowsCallOfMethod($methodName)
    {
        return true;
    }
}
