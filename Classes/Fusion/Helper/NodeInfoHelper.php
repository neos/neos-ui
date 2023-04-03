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
use Neos\ContentRepository\Domain\Service\ContextFactoryInterface;
use Neos\ContentRepository\Domain\Utility\NodePaths;
use Neos\Eel\ProtectedContextAwareInterface;
use Neos\Flow\Annotations as Flow;
use Neos\Flow\Mvc\Controller\ControllerContext;
use Neos\Flow\Persistence\PersistenceManagerInterface;
use Neos\Neos\Domain\Service\ContentContext;
use Neos\Neos\Service\LinkingService;
use Neos\Neos\Service\Mapping\NodePropertyConverterService;
use Neos\Neos\TypeConverter\EntityToIdentityConverter;
use Neos\Neos\Ui\Domain\Service\UserLocaleService;
use Neos\Neos\Ui\Service\NodePolicyService;

/**
 * @Flow\Scope("singleton")
 */
class NodeInfoHelper implements ProtectedContextAwareInterface
{
    /**
     * @Flow\Inject
     * @var NodePolicyService
     */
    protected $nodePolicyService;

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
     * @Flow\Inject
     * @var ContextFactoryInterface
     */
    protected $contextFactory;

    /**
     * @Flow\InjectConfiguration(path="userInterface.navigateComponent.nodeTree.presets.default.baseNodeType", package="Neos.Neos")
     * @var string
     */
    protected $defaultBaseNodeType;

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
     * @Flow\InjectConfiguration(path="nodeTypeRoles.ignored", package="Neos.Neos.Ui")
     * @var string
     */
    protected $ignoredNodeTypeRole;

    /**
     * @param NodeInterface $node
     * @param ControllerContext $controllerContext
     * @param bool $omitMostPropertiesForTreeState
     * @param string $nodeTypeFilterOverride
     * @return array
     * @deprecated See methods with specific names for different behaviors
     */
    public function renderNode(NodeInterface $node, ControllerContext $controllerContext = null, $omitMostPropertiesForTreeState = false, $nodeTypeFilterOverride = null)
    {
        return ($omitMostPropertiesForTreeState ?
            $this->renderNodeWithMinimalPropertiesAndChildrenInformation($node, $controllerContext, $nodeTypeFilterOverride) :
            $this->renderNodeWithPropertiesAndChildrenInformation($node, $controllerContext, $nodeTypeFilterOverride)
        );
    }

    /**
     * @param NodeInterface $node
     * @param ControllerContext|null $controllerContext
     * @param string $nodeTypeFilterOverride
     * @return array|null
     */
    public function renderNodeWithMinimalPropertiesAndChildrenInformation(NodeInterface $node, ControllerContext $controllerContext = null, string $nodeTypeFilterOverride = null)
    {
        if (!$this->nodePolicyService->isNodeTreePrivilegeGranted($node)) {
            return null;
        }
        $this->userLocaleService->switchToUILocale();

        $nodeInfo = $this->getBasicNodeInformation($node);
        $nodeInfo['properties'] = [
            // if we are only rendering the tree state, ensure _isHidden is sent to hidden nodes are correctly shown in the tree.
            '_hidden' => $node->isHidden(),
            '_hiddenInIndex' => $node->isHiddenInIndex(),
            '_hiddenBeforeDateTime' => $node->getHiddenBeforeDateTime() instanceof \DateTimeInterface ? $node->getHiddenBeforeDateTime()->format(\DateTime::W3C) : '',
            '_hiddenAfterDateTime' => $node->getHiddenAfterDateTime() instanceof \DateTimeInterface ? $node->getHiddenAfterDateTime()->format(\DateTime::W3C) : '',
        ];

        if ($controllerContext !== null) {
            $nodeInfo = array_merge($nodeInfo, $this->getUriInformation($node, $controllerContext));
            if ($controllerContext->getRequest()->hasArgument('presetBaseNodeType')) {
                $presetBaseNodeType = $controllerContext->getRequest()->getArgument('presetBaseNodeType');
            }
        }

        $baseNodeType = $nodeTypeFilterOverride ? $nodeTypeFilterOverride : (isset($presetBaseNodeType) ? $presetBaseNodeType : $this->defaultBaseNodeType);
        $nodeTypeFilter = $this->buildNodeTypeFilterString($this->nodeTypeStringsToList($baseNodeType), $this->nodeTypeStringsToList($this->ignoredNodeTypeRole));

        $nodeInfo['children'] = $this->renderChildrenInformation($node, $nodeTypeFilter);

        $this->userLocaleService->switchToUILocale(true);

        return $nodeInfo;
    }

    /**
     * @param NodeInterface $node
     * @param ControllerContext|null $controllerContext
     * @param string $nodeTypeFilterOverride
     * @return array|null
     */
    public function renderNodeWithPropertiesAndChildrenInformation(NodeInterface $node, ControllerContext $controllerContext = null, string $nodeTypeFilterOverride = null)
    {
        if (!$this->nodePolicyService->isNodeTreePrivilegeGranted($node)) {
            return null;
        }

        $this->userLocaleService->switchToUILocale();

        $nodeInfo = $this->getBasicNodeInformation($node);
        $nodeInfo['properties'] = $this->nodePropertyConverterService->getPropertiesArray($node);
        $nodeInfo['isFullyLoaded'] = true;

        if ($controllerContext !== null) {
            $nodeInfo = array_merge($nodeInfo, $this->getUriInformation($node, $controllerContext));
            if ($controllerContext->getRequest()->hasArgument('presetBaseNodeType')) {
                $presetBaseNodeType = $controllerContext->getRequest()->getArgument('presetBaseNodeType');
            }
        }

        $baseNodeType = $nodeTypeFilterOverride ? $nodeTypeFilterOverride : (isset($presetBaseNodeType) ? $presetBaseNodeType : $this->defaultBaseNodeType);
        $nodeInfo['children'] = $this->renderChildrenInformation($node, $baseNodeType);

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
            $nodeInfo['uri'] = $this->uri($node, $controllerContext);
        } catch (\Neos\Neos\Exception $exception) {
            // Unless there is a serious problem with routes there shouldn't be an exception ever.
            $nodeInfo['uri'] = '';
        }

        return $nodeInfo;
    }

    /**
     * Get the basic information about a node.
     *
     * @param NodeInterface $node
     * @return array
     */
    protected function getBasicNodeInformation(NodeInterface $node): array
    {
        return [
            'contextPath' => $node->getContextPath(),
            'name' => $node->getName(),
            'identifier' => $node->getIdentifier(),
            'nodeType' => $node->getNodeType()->getName(),
            'label' => $node->getLabel(),
            'isAutoCreated' => $node->isAutoCreated(),
            'depth' => $node->getDepth(),
            'children' => [],
            // In some rare cases the parent node cannot be resolved properly
            'parent' => ($node->getParent() ? $node->getParent()->getContextPath() : null),
            'matchesCurrentDimensions' => ($node instanceof Node && $node->dimensionsAreMatchingTargetDimensionValues())
        ];
    }

    /**
     * Get information for all children of the given parent node.
     *
     * @param NodeInterface $node
     * @param string $nodeTypeFilterString
     * @return array
     */
    protected function renderChildrenInformation(NodeInterface $node, string $nodeTypeFilterString): array
    {
        $documentChildNodes = $node->getChildNodes($nodeTypeFilterString);
        // child nodes for content tree, must not include those nodes filtered out by `baseNodeType`
        $contentChildNodes = $node->getChildNodes($this->buildContentChildNodeFilterString());
        $childNodes = array_merge($documentChildNodes, $contentChildNodes);

        $mapper = function (NodeInterface $childNode) {
            return [
                'contextPath' => $childNode->getContextPath(),
                'nodeType' => $childNode->getNodeType()->getName() // TODO: DUPLICATED; should NOT be needed!!!
            ];
        };

        return array_map($mapper, $childNodes);
    }

    /**
     * @param array $nodes
     * @param ControllerContext $controllerContext
     * @param bool $omitMostPropertiesForTreeState
     * @return array
     */
    public function renderNodes(array $nodes, ControllerContext $controllerContext, $omitMostPropertiesForTreeState = false): array
    {
        $methodName = $omitMostPropertiesForTreeState ? 'renderNodeWithMinimalPropertiesAndChildrenInformation' : 'renderNodeWithPropertiesAndChildrenInformation';
        $mapper = function (NodeInterface $node) use ($controllerContext, $methodName) {
            return $this->$methodName($node, $controllerContext);
        };

        return array_values(array_filter(array_map($mapper, $nodes)));
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
            } elseif ($renderedNode = $this->renderNodeWithMinimalPropertiesAndChildrenInformation($node, $controllerContext, $baseNodeTypeOverride)) {
                $renderedNode['matched'] = true;
                $renderedNodes[$node->getPath()] = $renderedNode;
            } else {
                continue;
            }

            /* @var $contentContext ContentContext */
            $contentContext = $node->getContext();
            $siteNodePath = $contentContext->getCurrentSiteNode()->getPath();
            $parentNode = $node->getParent();
            if ($parentNode === null) {
                // There are a multitude of reasons why a node might not have a parent and we should ignore these gracefully.
                continue;
            }

            // we additionally need to check that our parent nodes are underneath the site node; otherwise it might happen that
            // we try to send the "/sites" node to the UI (which we cannot do, because this does not have an URL)
            $parentNodeIsUnderneathSiteNode = (strpos($parentNode->getPath(), $siteNodePath) === 0);
            while ($parentNode->getNodeType()->isOfType($baseNodeTypeOverride) && $parentNodeIsUnderneathSiteNode) {
                if (array_key_exists($parentNode->getPath(), $renderedNodes)) {
                    $renderedNodes[$parentNode->getPath()]['intermediate'] = true;
                } else {
                    $renderedParentNode = $this->renderNodeWithMinimalPropertiesAndChildrenInformation($parentNode, $controllerContext, $baseNodeTypeOverride);
                    if ($renderedParentNode) {
                        $renderedParentNode['intermediate'] = true;
                        $renderedNodes[$parentNode->getPath()] = $renderedParentNode;
                    }
                }
                $parentNode = $parentNode->getParent();
                if ($parentNode === null) {
                    // There are a multitude of reasons why a node might not have a parent and we should ignore these gracefully.
                    break;
                }
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
     * @param ControllerContext $controllerContext
     * @return array
     */
    protected function renderNodeAndChildContent(NodeInterface $node, ControllerContext $controllerContext)
    {
        $reducer = function ($nodes, $node) use ($controllerContext) {
            $nodes = array_merge($nodes, $this->renderNodeAndChildContent($node, $controllerContext));

            return $nodes;
        };

        return array_reduce($node->getChildNodes($this->buildContentChildNodeFilterString()), $reducer, [$node->getContextPath() => $this->renderNodeWithPropertiesAndChildrenInformation($node, $controllerContext)]);
    }

    /**
     * @param NodeInterface $site
     * @param NodeInterface $documentNode
     * @param ControllerContext $controllerContext
     * @return array
     */
    public function defaultNodesForBackend(NodeInterface $site, NodeInterface $documentNode, ControllerContext $controllerContext): array
    {
        return [
            $site->getContextPath() => $this->renderNodeWithPropertiesAndChildrenInformation($site, $controllerContext),
            $documentNode->getContextPath() => $this->renderNodeWithPropertiesAndChildrenInformation($documentNode, $controllerContext)
        ];
    }

    /**
     * Creates a URL that will redirect to the given $node in live or base workspace, or returns an empty string if that doesn't exist or is inaccessible
     *
     * @param ControllerContext $controllerContext
     * @param NodeInterface|null $node
     * @return string
     */
    public function createRedirectToNode(ControllerContext $controllerContext, NodeInterface $node = null)
    {
        if ($node === null) {
            return '';
        }
        // we always want to redirect to the node in the base workspace.
        $baseWorkspace = $node->getContext()->getWorkspace(false)->getBaseWorkspace();
        $baseWorkspaceContextProperties = [
            'workspaceName' => $baseWorkspace !== null ? $baseWorkspace->getName() : 'live',
            'invisibleContentShown' => false,
            'removedContentShown' => false,
            'inaccessibleContentShown' => false,
        ];
        $baseWorkspaceContext = $this->contextFactory->create(array_merge($node->getContext()->getProperties(), $baseWorkspaceContextProperties));
        $nodeInBaseWorkspace = $baseWorkspaceContext->getNodeByIdentifier($node->getIdentifier());
        if ($nodeInBaseWorkspace === null || $nodeInBaseWorkspace->isHidden() || !$nodeInBaseWorkspace->getNodeType()->isAggregate()) {
            return '';
        }
        return $controllerContext->getUriBuilder()
            ->reset()
            ->setCreateAbsoluteUri(true)
            ->setFormat('html')
            ->uriFor('redirectTo', ['node' => $nodeInBaseWorkspace], 'Backend', 'Neos.Neos.Ui');
    }

    /**
     * @param NodeInterface $node
     * @param ControllerContext $controllerContext
     * @return string
     * @throws \Neos\Neos\Exception
     */
    public function uri(NodeInterface $node = null, ControllerContext $controllerContext)
    {
        if ($node === null) {
            // This happens when the document node is not published yet
            return '';
        }

        // Create an absolute URI
        return $this->linkingService->createNodeUri($controllerContext, $node, null, null, true);
    }

    /**
     * @param string ...$nodeTypeStrings
     * @return string[]
     */
    protected function nodeTypeStringsToList(string ...$nodeTypeStrings)
    {
        $reducer = function ($nodeTypeList, $nodeTypeString) {
            $nodeTypeParts = explode(',', $nodeTypeString);
            foreach ($nodeTypeParts as $nodeTypeName) {
                $nodeTypeList[] = trim($nodeTypeName);
            }

            return $nodeTypeList;
        };

        return array_reduce($nodeTypeStrings, $reducer, []);
    }

    /**
     * @param array $includedNodeTypes
     * @param array $excludedNodeTypes
     * @return string
     */
    protected function buildNodeTypeFilterString(array $includedNodeTypes, array $excludedNodeTypes)
    {
        $preparedExcludedNodeTypes = array_map(function ($nodeTypeName) {
            return '!' . $nodeTypeName;
        }, $excludedNodeTypes);
        $mergedIncludesAndExcludes = array_merge($includedNodeTypes, $preparedExcludedNodeTypes);
        return implode(',', $mergedIncludesAndExcludes);
    }

    /**
     * @return string
     */
    protected function buildContentChildNodeFilterString()
    {
        return $this->buildNodeTypeFilterString([], $this->nodeTypeStringsToList($this->documentNodeTypeRole, $this->ignoredNodeTypeRole));
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
