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

use Neos\ContentRepository\Core\Feature\SubtreeTagging\Dto\SubtreeTag;
use Neos\ContentRepository\Core\Projection\ContentGraph\Filter\CountAncestorNodesFilter;
use Neos\ContentRepository\Core\Projection\ContentGraph\Filter\FindChildNodesFilter;
use Neos\ContentRepository\Core\Projection\ContentGraph\Node;
use Neos\ContentRepository\Core\SharedModel\Node\NodeAddress;
use Neos\ContentRepository\Core\SharedModel\Node\NodeAggregateClassification;
use Neos\ContentRepository\Core\SharedModel\Workspace\WorkspaceName;
use Neos\ContentRepositoryRegistry\ContentRepositoryRegistry;
use Neos\Eel\ProtectedContextAwareInterface;
use Neos\Flow\Annotations as Flow;
use Neos\Flow\Mvc\ActionRequest;
use Neos\Flow\Mvc\Routing\UriBuilder;
use Neos\Flow\Persistence\PersistenceManagerInterface;
use Neos\Neos\Domain\NodeLabel\NodeLabelGeneratorInterface;
use Neos\Neos\FrontendRouting\NodeUriBuilderFactory;
use Neos\Neos\Ui\Domain\Service\NodePropertyConverterService;
use Neos\Neos\Ui\Domain\Service\UserLocaleService;
use Neos\Neos\Utility\NodeTypeWithFallbackProvider;

/**
 * @Flow\Scope("singleton")
 * @internal implementation detail of the Neos Ui to build its initialState.
 *           and used for rendering node properties for the inline element wrapping from php.
 */
class NodeInfoHelper implements ProtectedContextAwareInterface
{
    use NodeTypeWithFallbackProvider;

    #[Flow\Inject]
    protected ContentRepositoryRegistry $contentRepositoryRegistry;

    #[Flow\Inject]
    protected NodeUriBuilderFactory $nodeUriBuilderFactory;

    #[Flow\Inject]
    protected NodeLabelGeneratorInterface $nodeLabelGenerator;

    /**
     * @Flow\Inject
     * @var UserLocaleService
     */
    protected $userLocaleService;

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
     */
    public function renderNodeWithMinimalPropertiesAndChildrenInformation(
        Node $node,
        ActionRequest $actionRequest = null,
        string $nodeTypeFilterOverride = null
    ): ?array {
        /** @todo implement custom node policy service
        if (!$this->nodePolicyService->isNodeTreePrivilegeGranted($node)) {
        return null;
        }*/
        $this->userLocaleService->switchToUILocale();

        $nodeInfo = $this->getBasicNodeInformation($node);
        $nodeInfo['properties'] = [
            // if we are only rendering the tree state,
            // ensure _isHidden is sent to hidden nodes are correctly shown in the tree.
            // TODO: we should export this correctly named, but that needs changes throughout the JS code as well.
            '_hidden' => $node->tags->withoutInherited()->contain(SubtreeTag::disabled()),
            '_hiddenInIndex' => $node->getProperty('hiddenInMenu'),
            '_hasTimeableNodeVisibility' =>
                $node->getProperty('enableAfterDateTime') instanceof \DateTimeInterface
                || $node->getProperty('disableAfterDateTime') instanceof \DateTimeInterface,
        ];

        if ($actionRequest !== null) {
            $nodeInfo = array_merge($nodeInfo, $this->getUriInformation($node, $actionRequest));
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
        ActionRequest $actionRequest = null,
        string $nodeTypeFilterOverride = null
    ): ?array {
        /** @todo implement custom node policy service
        if (!$this->nodePolicyService->isNodeTreePrivilegeGranted($node)) {
        return null;
        }**/

        $this->userLocaleService->switchToUILocale();

        $nodeInfo = $this->getBasicNodeInformation($node);
        $nodeInfo['properties'] = $this->nodePropertyConverterService->getPropertiesArray($node);
        $nodeInfo['tags'] = $node->tags;
        $nodeInfo['isFullyLoaded'] = true;

        if ($actionRequest !== null) {
            $nodeInfo = array_merge($nodeInfo, $this->getUriInformation($node, $actionRequest));
        }

        $baseNodeType = $nodeTypeFilterOverride ?: $this->baseNodeType;
        $nodeInfo['children'] = $this->renderChildrenInformation($node, $baseNodeType);

        $this->userLocaleService->switchToUILocale(true);

        return $nodeInfo;
    }

    /**
     * Get the "uri" and "previewUri" for the given node
     *
     * @param Node $node
     * @return array<string,string>
     */
    protected function getUriInformation(Node $node, ActionRequest $actionRequest): array
    {
        $nodeInfo = [];
        if (!$this->getNodeType($node)->isOfType($this->documentNodeTypeRole)) {
            return $nodeInfo;
        }
        $nodeInfo['uri'] = $this->previewUri($node, $actionRequest);
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
        $parentNode = $subgraph->findParentNode($node->aggregateId);

        $nodeAddress = NodeAddress::fromNode($node);

        return [
            'contextPath' => $nodeAddress->toJson(),
            'nodeAddress' => $nodeAddress->toJson(),
            'name' => $node->name?->value ?? '',
            'identifier' => $node->aggregateId->jsonSerialize(),
            'nodeType' => $node->nodeTypeName->value,
            'label' => $this->nodeLabelGenerator->getLabel($node),
            'isAutoCreated' => $node->classification === NodeAggregateClassification::CLASSIFICATION_TETHERED,
            // TODO: depth is expensive to calculate; maybe let's get rid of this?
            'depth' => $subgraph->countAncestorNodes(
                $node->aggregateId,
                CountAncestorNodesFilter::create()
            ),
            'children' => [],
            'parent' => $parentNode ? NodeAddress::fromNode($parentNode)->toJson() : null,
            'matchesCurrentDimensions' => $node->dimensionSpacePoint->equals($node->originDimensionSpacePoint),
            'lastModificationDateTime' => $node->timestamps->lastModified?->format(\DateTime::ATOM),
            'creationDateTime' => $node->timestamps->created->format(\DateTime::ATOM),
            'lastPublicationDateTime' => $node->timestamps->originalLastModified?->format(\DateTime::ATOM)
        ];
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
        $contentRepository = $this->contentRepositoryRegistry->get($node->contentRepositoryId);
        $subgraph = $this->contentRepositoryRegistry->subgraphForNode($node);

        $documentChildNodes = $subgraph->findChildNodes(
            $node->aggregateId,
            FindChildNodesFilter::create(nodeTypes: $nodeTypeFilterString)
        );
        // child nodes for content tree, must not include those nodes filtered out by `baseNodeType`
        $contentChildNodes = $subgraph->findChildNodes(
            $node->aggregateId,
            FindChildNodesFilter::create(
                nodeTypes: $this->buildContentChildNodeFilterString()
            )
        );
        $childNodes = $documentChildNodes->merge($contentChildNodes);

        $infos = [];
        foreach ($childNodes as $childNode) {
            $contentRepository = $this->contentRepositoryRegistry->get($childNode->contentRepositoryId);
            $infos[] = [
                'contextPath' => NodeAddress::fromNode($childNode)->toJson(),
                'nodeType' => $childNode->nodeTypeName->value
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
        ActionRequest $actionRequest,
        bool $omitMostPropertiesForTreeState = false
    ): array {
        $mapper = function (Node $node) use ($actionRequest, $omitMostPropertiesForTreeState) {
            return $omitMostPropertiesForTreeState
                ? $this->renderNodeWithMinimalPropertiesAndChildrenInformation($node, $actionRequest)
                : $this->renderNodeWithPropertiesAndChildrenInformation($node, $actionRequest);
        };
        return array_values(array_filter(array_map($mapper, $nodes)));
    }

    /**
     * @param array<int,?array<string,mixed>> $nodes
     * @return array<int,?array<string,mixed>>
     */
    public function renderNodesWithParents(array $nodes, ActionRequest $actionRequest, ?string $nodeTypeFilter = null): array
    {
        // For search operation we want to include all nodes, not respecting the "baseNodeType" setting
        $baseNodeTypeOverride = $this->documentNodeTypeRole;
        $renderedNodes = [];

        /** @var Node $node */
        foreach ($nodes as $node) {
            $subgraph = $this->contentRepositoryRegistry->subgraphForNode($node);

            if (array_key_exists($node->aggregateId->value, $renderedNodes)) {
                $renderedNodes[$node->aggregateId->value]['matched'] = true;
            } elseif ($renderedNode = $this->renderNodeWithMinimalPropertiesAndChildrenInformation(
                $node,
                $actionRequest,
                $nodeTypeFilter ?? $baseNodeTypeOverride
            )) {
                $renderedNode['matched'] = true;
                $renderedNodes[$node->aggregateId->value] = $renderedNode;
            } else {
                continue;
            }

            $parentNode = $subgraph->findParentNode($node->aggregateId);
            if ($parentNode === null) {
                // There are a multitude of reasons why a node might not have a parent
                // and we should ignore these gracefully.
                continue;
            }

            while ($this->getNodeType($parentNode)->isOfType($baseNodeTypeOverride)) {
                if (array_key_exists($parentNode->aggregateId->value, $renderedNodes)) {
                    $renderedNodes[$parentNode->aggregateId->value]['intermediate'] = true;
                } else {
                    $renderedParentNode = $this->renderNodeWithMinimalPropertiesAndChildrenInformation(
                        $parentNode,
                        $actionRequest,
                        $baseNodeTypeOverride
                    );
                    if ($renderedParentNode) {
                        $renderedParentNode['intermediate'] = true;
                        $renderedNodes[$parentNode->aggregateId->value] = $renderedParentNode;
                    }
                }
                $parentNode = $subgraph->findParentNode($parentNode->aggregateId);
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
     * @return array<string,array<string,mixed>|null>
     */
    public function defaultNodesForBackend(
        Node $site,
        Node $documentNode,
        ActionRequest $actionRequest
    ): array {
        // does not support multiple CRs here yet
        $contentRepository = $this->contentRepositoryRegistry->get($site->contentRepositoryId);

        return [
            (NodeAddress::fromNode($site)->toJson())
            => $this->renderNodeWithPropertiesAndChildrenInformation($site, $actionRequest),
            (NodeAddress::fromNode($documentNode)->toJson())
            => $this->renderNodeWithPropertiesAndChildrenInformation($documentNode, $actionRequest)
        ];
    }

    public function previewUri(Node $node, ActionRequest $actionRequest): string
    {
        $nodeAddress = NodeAddress::fromNode($node);
        return (string)$this->nodeUriBuilderFactory
            ->forActionRequest($actionRequest)
            ->previewUriFor($nodeAddress);
    }

    public function createRedirectToNode(Node $node, ActionRequest $actionRequest): string
    {
        // we always want to redirect to the node in the base workspace.
        $contentRepository = $this->contentRepositoryRegistry->get($node->contentRepositoryId);
        $workspace = $contentRepository->findWorkspaceByName($node->workspaceName);

        $nodeAddress = NodeAddress::create(
            $node->contentRepositoryId,
            $workspace->baseWorkspaceName ?? WorkspaceName::forLive(),
            $node->dimensionSpacePoint,
            $node->aggregateId
        );

        $uriBuilder = new UriBuilder();
        $uriBuilder->setRequest($actionRequest);
        return $uriBuilder
            ->setCreateAbsoluteUri(true)
            ->setFormat('html')
            ->uriFor('redirectTo', ['node' => $nodeAddress->toJson()], 'Backend', 'Neos.Neos.Ui');
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

    public function serializedNodeAddress(Node $node): string
    {
        $contentRepository = $this->contentRepositoryRegistry->get($node->contentRepositoryId);
        return NodeAddress::fromNode($node)->toJson();
    }

    /**
     * @param string $methodName
     * @return boolean
     */
    public function allowsCallOfMethod($methodName)
    {
        // to control what is used in eel we maintain this list.
        return in_array($methodName, [
            'serializedNodeAddress',
            'createRedirectToNode',
            'renderNodeWithPropertiesAndChildrenInformation',
            'defaultNodesForBackend',
            'previewUri'
        ], true);
    }
}
