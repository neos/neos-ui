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

use Neos\ContentRepository\Core\Projection\ContentGraph\ContentSubgraphInterface;
use Neos\ContentRepository\Core\Projection\ContentGraph\Node;
use Neos\ContentRepository\Core\Projection\ContentGraph\Nodes;
use Neos\ContentRepository\Core\Projection\NodeHiddenState\NodeHiddenState;
use Neos\ContentRepository\Core\Projection\NodeHiddenState\NodeHiddenStateFinder;
use Neos\ContentRepository\Core\Projection\NodeHiddenState\NodeHiddenStateProjection;
use Neos\Neos\FrontendRouting\NodeAddress;
use Neos\Neos\FrontendRouting\NodeAddressFactory;
use Neos\ContentRepository\Core\NodeType\NodeTypeConstraintParser;
use Neos\ContentRepository\Core\Projection\ContentGraph\NodeTypeConstraints;
use Neos\ContentRepositoryRegistry\ContentRepositoryRegistry;
use Neos\Eel\ProtectedContextAwareInterface;
use Neos\Flow\Annotations as Flow;
use Neos\Flow\Mvc\Controller\ControllerContext;
use Neos\Flow\Persistence\PersistenceManagerInterface;
use Neos\Neos\FrontendRouting\NodeUriBuilder;
use Neos\Neos\TypeConverter\EntityToIdentityConverter;
use Neos\Neos\Ui\Domain\Service\NodePropertyConverterService;
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
     * @var ContentRepositoryRegistry
     */
    protected $contentRepositoryRegistry;

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
     * @Flow\InjectConfiguration(path="nodeTypeRoles.ignored", package="Neos.Neos.Ui")
     * @var string
     */
    protected $ignoredNodeTypeRole;

    /**
     * @return ?array<string,mixed>
     * @deprecated See methods with specific names for different behaviors
     */
    public function renderNode(
        Node $node,
        ControllerContext $controllerContext = null,
        bool $omitMostPropertiesForTreeState = false,
        string $nodeTypeFilterOverride = null
    ):?array {
        return ($omitMostPropertiesForTreeState
            ? $this->renderNodeWithMinimalPropertiesAndChildrenInformation(
                $node,
                $controllerContext,
                $nodeTypeFilterOverride
            )
            : $this->renderNodeWithPropertiesAndChildrenInformation(
                $node,
                $controllerContext,
                $nodeTypeFilterOverride
            )
        );
    }

    /**
     * @return ?array<string,mixed>
     */
    public function renderNodeWithMinimalPropertiesAndChildrenInformation(
        Node $node,
        ControllerContext $controllerContext = null,
        string $nodeTypeFilterOverride = null
    ): ?array {
        $contentRepository = $this->contentRepositoryRegistry->get($node->subgraphIdentity->contentRepositoryId);
        $nodeHiddenStateFinder = $contentRepository->projectionState(NodeHiddenStateFinder::class);

        /** @todo implement custom node policy service
        if (!$this->nodePolicyService->isNodeTreePrivilegeGranted($node)) {
        return null;
        }*/
        $this->userLocaleService->switchToUILocale();

        $nodeInfo = $this->getBasicNodeInformation($node);
        $nodeInfo['properties'] = [
            // if we are only rendering the tree state,
            // ensure _isHidden is sent to hidden nodes are correctly shown in the tree.
            '_hidden' => $nodeHiddenStateFinder->findHiddenState(
                $node->subgraphIdentity->contentStreamId,
                $node->subgraphIdentity->dimensionSpacePoint,
                $node->nodeAggregateId
            )->isHidden,
            '_hiddenInIndex' => $node->getProperty('_hiddenInIndex'),
            //'_hiddenBeforeDateTime' => $node->getHiddenBeforeDateTime() instanceof \DateTimeInterface,
            //'_hiddenAfterDateTime' => $node->getHiddenAfterDateTime() instanceof \DateTimeInterface,
        ];

        if ($controllerContext !== null) {
            $nodeInfo = array_merge($nodeInfo, $this->getUriInformation($node, $controllerContext));
        }

        $baseNodeType = $nodeTypeFilterOverride ?: $this->baseNodeType;
        $nodeTypeFilter = $this->buildNodeTypeFilterString(
            $this->nodeTypeStringsToList($baseNodeType),
            $this->nodeTypeStringsToList($this->ignoredNodeTypeRole)
        );

        $nodeInfo['children'] = $this->renderChildrenInformation($node, $nodeTypeFilter);

        $this->userLocaleService->switchToUILocale(true);

        return $nodeInfo;
    }

    /**
     * @return ?array<string,mixed>
     */
    public function renderNodeWithPropertiesAndChildrenInformation(
        Node $node,
        ControllerContext $controllerContext = null,
        string $nodeTypeFilterOverride = null
    ): ?array {
        /** @todo implement custom node policy service
        if (!$this->nodePolicyService->isNodeTreePrivilegeGranted($node)) {
        return null;
        }**/

        $this->userLocaleService->switchToUILocale();

        $nodeInfo = $this->getBasicNodeInformation($node);
        $nodeInfo['properties'] = $this->nodePropertyConverterService->getPropertiesArray($node);
        $nodeInfo['isFullyLoaded'] = true;

        if ($controllerContext !== null) {
            $nodeInfo = array_merge($nodeInfo, $this->getUriInformation($node, $controllerContext));
        }

        $baseNodeType = $nodeTypeFilterOverride ? $nodeTypeFilterOverride : $this->baseNodeType;
        $nodeInfo['children'] = $this->renderChildrenInformation($node, $baseNodeType);

        $this->userLocaleService->switchToUILocale(true);

        return $nodeInfo;
    }

    /**
     * Get the "uri" and "previewUri" for the given node
     *
     * @param Node $node
     * @param ControllerContext $controllerContext
     * @return array<string,string>
     */
    protected function getUriInformation(Node $node, ControllerContext $controllerContext): array
    {
        $nodeInfo = [];
        if (!$node->nodeType->isOfType($this->documentNodeTypeRole)) {
            return $nodeInfo;
        }
        $nodeInfo['uri'] = $this->previewUri($node, $controllerContext);
        return $nodeInfo;
    }

    /**
     * Get the basic information about a node.
     *
     * @return array<string,mixed>
     */
    protected function getBasicNodeInformation(Node $node): array
    {
        $subgraph = $this->contentRepositoryRegistry->subgraphForNode($node);
        $parentNode = $subgraph->findParentNode($node->nodeAggregateId);

        $contentRepository = $this->contentRepositoryRegistry->get($node->subgraphIdentity->contentRepositoryId);
        $nodeAddressFactory = NodeAddressFactory::create($contentRepository);

        return [
            'contextPath' => $nodeAddressFactory->createFromNode($node)->serializeForUri(),
            'name' => $node->nodeName?->jsonSerialize(),
            'identifier' => $node->nodeAggregateId->jsonSerialize(),
            'nodeType' => $node->nodeType->getName(),
            'label' => $node->getLabel(),
            'isAutoCreated' => self::isAutoCreated($node, $subgraph),
            // TODO: depth is expensive to calculate; maybe let's get rid of this?
            'depth' => $subgraph->findNodePath($node->nodeAggregateId)->getDepth(),
            'children' => [],
            'parent' => $parentNode ? $nodeAddressFactory->createFromNode($parentNode)->serializeForUri() : null,
            'matchesCurrentDimensions' => $node->subgraphIdentity->dimensionSpacePoint->equals($node->originDimensionSpacePoint)
        ];
    }

    public static function isAutoCreated(Node $node, ContentSubgraphInterface $subgraph): bool
    {
        $parent = $subgraph->findParentNode($node->nodeAggregateId);
        if ($parent) {
            if (array_key_exists((string)$node->nodeName, $parent->nodeType->getAutoCreatedChildNodes())) {
                return true;
            }
        }
        return false;
    }

    /**
     * Get information for all children of the given parent node.
     *
     * @param Node $node
     * @param string $nodeTypeFilterString
     * @return array<int,array<string,string>>
     */
    protected function renderChildrenInformation(Node $node, string $nodeTypeFilterString): array
    {
        $contentRepository = $this->contentRepositoryRegistry->get($node->subgraphIdentity->contentRepositoryId);
        $subgraph = $this->contentRepositoryRegistry->subgraphForNode($node);

        $documentChildNodes = $subgraph->findChildNodes(
            $node->nodeAggregateId,
            NodeTypeConstraints::fromFilterString($nodeTypeFilterString)
        );
        // child nodes for content tree, must not include those nodes filtered out by `baseNodeType`
        $contentChildNodes = $subgraph->findChildNodes(
            $node->nodeAggregateId,
            NodeTypeConstraints::fromFilterString(
                $this->buildContentChildNodeFilterString()
            )
        );
        $childNodes = $documentChildNodes->merge($contentChildNodes);

        $infos = [];
        foreach ($childNodes as $childNode) {
            $contentRepository = $this->contentRepositoryRegistry->get($childNode->subgraphIdentity->contentRepositoryId);
            $nodeAddressFactory = NodeAddressFactory::create($contentRepository);
            $infos[] = [
                'contextPath' => $nodeAddressFactory->createFromNode($childNode)->serializeForUri(),
                'nodeType' => $childNode->nodeType->getName() // TODO: DUPLICATED; should NOT be needed!!!
            ];
        };
        return $infos;
    }

    /**
     * @param array<int,Node> $nodes
     * @return array<int,?array<string,mixed>>
     */
    public function renderNodes(
        array $nodes,
        ControllerContext $controllerContext,
        bool $omitMostPropertiesForTreeState = false
    ): array {
        $methodName = $omitMostPropertiesForTreeState
            ? 'renderNodeWithMinimalPropertiesAndChildrenInformation'
            : 'renderNodeWithPropertiesAndChildrenInformation';
        $mapper = function (Node $node) use ($controllerContext, $methodName) {
            return $this->$methodName($node, $controllerContext);
        };

        return array_values(array_filter(array_map($mapper, $nodes)));
    }

    /**
     * @param array<int,?array<string,mixed>> $nodes
     * @return array<int,?array<string,mixed>>
     */
    public function renderNodesWithParents(array $nodes, ControllerContext $controllerContext): array
    {
        // For search operation we want to include all nodes, not respecting the "baseNodeType" setting
        $baseNodeTypeOverride = $this->documentNodeTypeRole;
        $renderedNodes = [];

        /** @var Node $node */
        foreach ($nodes as $node) {
            $subgraph = $this->contentRepositoryRegistry->subgraphForNode($node);

            $nodePath = $subgraph->findNodePath($node->nodeAggregateId);
            if (array_key_exists($nodePath->jsonSerialize(), $renderedNodes)) {
                $renderedNodes[(string)$nodePath]['matched'] = true;
            } elseif ($renderedNode = $this->renderNodeWithMinimalPropertiesAndChildrenInformation(
                $node,
                $controllerContext,
                $baseNodeTypeOverride
            )) {
                $renderedNode['matched'] = true;
                $renderedNodes[(string)$nodePath] = $renderedNode;
            } else {
                continue;
            }

            $parentNode = $subgraph->findParentNode($node->nodeAggregateId);
            if ($parentNode === null) {
                // There are a multitude of reasons why a node might not have a parent
                // and we should ignore these gracefully.
                continue;
            }

            $parentNodePath = $subgraph->findNodePath($parentNode->nodeAggregateId);
            while ($parentNode->nodeType->isOfType($baseNodeTypeOverride)) {
                if (array_key_exists((string)$parentNodePath, $renderedNodes)) {
                    $renderedNodes[(string)$parentNodePath]['intermediate'] = true;
                } else {
                    $renderedParentNode = $this->renderNodeWithMinimalPropertiesAndChildrenInformation(
                        $parentNode,
                        $controllerContext,
                        $baseNodeTypeOverride
                    );
                    if ($renderedParentNode) {
                        $renderedParentNode['intermediate'] = true;
                        $renderedNodes[(string)$parentNodePath] = $renderedParentNode;
                    }
                }
                $parentNode = $subgraph->findParentNode($parentNode->nodeAggregateId);
                if ($parentNode === null) {
                    // There are a multitude of reasons why a node might not have a parent
                    // and we should ignore these gracefully.
                    break;
                }
            }
        }

        return array_values($renderedNodes);
    }

    /**
     * @param Node $documentNode
     * @param ControllerContext $controllerContext
     * @return array<string,mixed>>
     */
    public function renderDocumentNodeAndChildContent(
        Node $documentNode,
        ControllerContext $controllerContext
    ): array {
        return $this->renderNodeAndChildContent($documentNode, $controllerContext);
    }

    /**
     * @return array<string,mixed>>
     */
    protected function renderNodeAndChildContent(Node $node, ControllerContext $controllerContext): array
    {
        $reducer = function ($nodes, $node) use ($controllerContext) {
            return array_merge($nodes, $this->renderNodeAndChildContent($node, $controllerContext));
        };

        $contentRepository = $this->contentRepositoryRegistry->get($node->subgraphIdentity->contentRepositoryId);
        $nodeAddressFactory = NodeAddressFactory::create($contentRepository);

        return array_reduce(
            $this->getChildNodes($node, $this->buildContentChildNodeFilterString())
                ->getIterator()->getArrayCopy(),
            $reducer,
            [
                $nodeAddressFactory->createFromNode($node)->serializeForUri()
                => $this->renderNodeWithPropertiesAndChildrenInformation($node, $controllerContext)
            ]
        );
    }

    /**
     * @return array<string,array<string,mixed>|null>
     */
    public function defaultNodesForBackend(
        Node $site,
        Node $documentNode,
        ControllerContext $controllerContext
    ): array {
        // does not support multiple CRs here yet
        $contentRepository = $this->contentRepositoryRegistry->get($site->subgraphIdentity->contentRepositoryId);
        $nodeAddressFactory = NodeAddressFactory::create($contentRepository);

        return [
            ($nodeAddressFactory->createFromNode($site)->serializeForUri())
            => $this->renderNodeWithPropertiesAndChildrenInformation($site, $controllerContext),
            ($nodeAddressFactory->createFromNode($documentNode)->serializeForUri())
            => $this->renderNodeWithPropertiesAndChildrenInformation($documentNode, $controllerContext)
        ];
    }

    public function uri(Node|NodeAddress $nodeAddress, ControllerContext $controllerContext): string
    {
        if ($nodeAddress instanceof Node) {
            $contentRepository = $this->contentRepositoryRegistry->get($nodeAddress->subgraphIdentity->contentRepositoryId);
            $nodeAddressFactory = NodeAddressFactory::create($contentRepository);
            $nodeAddress = $nodeAddressFactory->createFromNode($nodeAddress);
        }
        return (string)NodeUriBuilder::fromRequest($controllerContext->getRequest())->uriFor($nodeAddress);
    }

    public function previewUri(Node $node, ControllerContext $controllerContext): string
    {
        $contentRepository = $this->contentRepositoryRegistry->get($node->subgraphIdentity->contentRepositoryId);
        $nodeAddressFactory = NodeAddressFactory::create($contentRepository);
        $nodeAddress = $nodeAddressFactory->createFromNode($node);
        return (string)NodeUriBuilder::fromRequest($controllerContext->getRequest())->previewUriFor($nodeAddress);
    }

    public function createRedirectToNode(Node $node, ControllerContext $controllerContext): string
    {
        $contentRepository = $this->contentRepositoryRegistry->get($node->subgraphIdentity->contentRepositoryId);
        $nodeAddressFactory = NodeAddressFactory::create($contentRepository);
        $nodeAddress = $nodeAddressFactory->createFromNode($node);
        return $controllerContext->getUriBuilder()
            ->reset()
            ->setCreateAbsoluteUri(true)
            ->setFormat('html')
            ->uriFor('redirectTo', ['node' => $nodeAddress->serializeForUri()], 'Backend', 'Neos.Neos.Ui');
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
     * @param array<int,string> $includedNodeTypes
     * @param array<int,string> $excludedNodeTypes
     */
    protected function buildNodeTypeFilterString(array $includedNodeTypes, array $excludedNodeTypes): string
    {
        $preparedExcludedNodeTypes = array_map(function ($nodeTypeName) {
            return '!' . $nodeTypeName;
        }, $excludedNodeTypes);
        $mergedIncludesAndExcludes = array_merge($includedNodeTypes, $preparedExcludedNodeTypes);
        return implode(',', $mergedIncludesAndExcludes);
    }

    protected function buildContentChildNodeFilterString(): string
    {
        return $this->buildNodeTypeFilterString(
            [],
            $this->nodeTypeStringsToList(
                $this->documentNodeTypeRole,
                $this->ignoredNodeTypeRole
            )
        );
    }

    private function getChildNodes(Node $node, string $nodeTypeFilterString): Nodes
    {
        $contentRepository = $this->contentRepositoryRegistry->get($node->subgraphIdentity->contentRepositoryId);

        return $this->contentRepositoryRegistry->subgraphForNode($node)
            ->findChildNodes(
                $node->nodeAggregateId,
                NodeTypeConstraints::fromFilterString($nodeTypeFilterString)
            );
    }

    public function nodeAddress(Node $node): NodeAddress
    {
        $contentRepository = $this->contentRepositoryRegistry->get($node->subgraphIdentity->contentRepositoryId);
        $nodeAddressFactory = NodeAddressFactory::create($contentRepository);
        return $nodeAddressFactory->createFromNode($node);
    }

    public function serializedNodeAddress(Node $node): string
    {
        $contentRepository = $this->contentRepositoryRegistry->get($node->subgraphIdentity->contentRepositoryId);
        $nodeAddressFactory = NodeAddressFactory::create($contentRepository);
        return $nodeAddressFactory->createFromNode($node)->serializeForUri();
    }

    public function inBackend(Node $node): bool
    {
        $contentRepository = $this->contentRepositoryRegistry->get($node->subgraphIdentity->contentRepositoryId);
        $nodeAddressFactory = NodeAddressFactory::create($contentRepository);
        return !$nodeAddressFactory->createFromNode($node)->isInLiveWorkspace();
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
