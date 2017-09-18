<?php
namespace Neos\Neos\Ui\Fusion\Helper;

use Neos\Flow\Annotations as Flow;
use Neos\Eel\ProtectedContextAwareInterface;
use Neos\Flow\Mvc\Controller\ControllerContext;
use Neos\Flow\Persistence\PersistenceManagerInterface;
use Neos\Flow\Property\PropertyMappingConfiguration;
use Neos\Media\Domain\Model\Asset;
use Neos\Media\Domain\Model\ImageInterface;
use Neos\Utility\ObjectAccess;
use Neos\Neos\Domain\Service\ContentContext;
use Neos\Neos\Service\LinkingService;
use Neos\Neos\TypeConverter\EntityToIdentityConverter;
use Neos\ContentRepository\Domain\Model\NodeInterface;
use Neos\Utility\TypeHandling;

/**
 * @Flow\Scope("singleton")
 */
class NodeInfoHelper implements ProtectedContextAwareInterface
{

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
        $baseNodeType = $baseNodeTypeOverride ? $baseNodeTypeOverride : $this->baseNodeType;
        $nodeInfo = [
            'contextPath' => $node->getContextPath(),
            'name' => $node->getName(),
            'identifier' => $node->getIdentifier(),
            'nodeType' => $node->getNodeType()->getName(),
            'properties' => $omitMostPropertiesForTreeState ? [
                // if we are only rendering the tree state, ensure _isHidden is sent to hidden nodes are correctly shown in the tree.
                '_hidden' => $node->isHidden()
            ] : $this->buildNodeProperties($node),
            'label' => $node->getLabel(),
            'isAutoCreated' => $node->isAutoCreated(),
            'depth' => $node->getDepth(),
            // TODO: 'uri' =>@if.onyRenderWhenNodeIsADocument = ${q(node).is('[instanceof Neos.Neos:Document]')}
            'children' => [],
        ];
        if ($controllerContext !== null && $node->getNodeType()->isOfType($this->documentNodeTypeRole)) {
            $nodeInfo['uri'] = $this->uri($node, $controllerContext);
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

        return $nodeInfo;
    }

    protected function renderNodeToList(&$nodes, NodeInterface $node, ControllerContext $controllerContext)
    {
        $nodes[$node->getContextPath()] = $this->renderNode($node, $controllerContext);
    }

    public function renderNodes(array $nodes, ControllerContext $controllerContext, $omitMostPropertiesForTreeState = false)
    {
        $renderedNodes = [];
        foreach ($nodes as $node) {
            $renderedNodes[] = $this->renderNode($node, $controllerContext, $omitMostPropertiesForTreeState);
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
            } else {
                $renderedNode = $this->renderNode($node, $controllerContext, true, $baseNodeTypeOverride);
                $renderedNode['matched'] = true;
                $renderedNodes[$node->getPath()] = $renderedNode;
            }

            $parentNode = $node->getParent();
            while ($parentNode->getNodeType()->isOfType($baseNodeTypeOverride)) {
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
        $nodes = [];
        if ($site !== $documentNode) {
            $this->renderNodeToList($nodes, $site, $controllerContext);
        }

        $renderNodesRecursively = function (&$nodes, $baseNode, $level = 0) use (&$renderNodesRecursively, $controllerContext) {
            if ($level < $this->loadingDepth || $this->loadingDepth === 0) {
                foreach ($baseNode->getChildNodes($this->baseNodeType) as $childNode) {
                    $this->renderNodeToList($nodes, $childNode, $controllerContext);
                    $renderNodesRecursively($nodes, $childNode, $level + 1);
                }
            }
        };
        $renderNodesRecursively($nodes, $site);

        $this->renderNodeToList($nodes, $documentNode, $controllerContext);

        return $nodes;
    }

    public function uri(NodeInterface $node = null, ControllerContext $controllerContext)
    {
        if ($node === null) {
            // This happens when the document node os not published yet
            return '';
        }
        // Create an absolute URI without resolving shortcuts
        return $this->linkingService->createNodeUri($controllerContext, $node, null, null, true, array(), '', false, array(), false);
    }

    /**
     * @param string $methodName
     * @return boolean
     */
    public function allowsCallOfMethod($methodName)
    {
        return true;
    }

    private function buildNodeProperties(NodeInterface $node)
    {
        $encodedProperties = [];

        foreach ($node->getNodeType()->getProperties() as $propertyName => $propertyConfiguration) {
            if (substr($propertyName, 0, 2) === '__') {
                // skip fully-private properties
                continue;
            }
            /** @var $contentContext ContentContext */
            $contentContext = $node->getContext();
            if ($propertyName === '_name' && $node === $contentContext->getCurrentSiteNode()) {
                // skip the node name of the site node
                continue;
            }
            if ($propertyName === '_nodeType') {
                // skip the node type as it is handled separately
                continue;
            }
            // Serialize objects to JSON strings
            $dataType = isset($propertyConfiguration['type']) ? $propertyConfiguration['type'] : 'string';
            $encodedProperties[$propertyName] = $this->buildNodeProperty($node, $propertyName, $dataType);
        }

        return $encodedProperties;
    }

    private function buildNodeProperty(NodeInterface $node, $propertyName, $dataType)
    {
        if ($propertyName === '_nodeType') {
            $propertyValue = $node->getNodeType()->getName();
        } elseif (substr($propertyName, 0, 1) === '_') {
            $propertyValue = ObjectAccess::getProperty($node, substr($propertyName, 1));
        } else {
            $propertyValue = $node->getProperty($propertyName);
        }

        // Enforce an integer value for integer properties as otherwise javascript will give NaN and VIE converts it to an array containing 16 times 'NaN'
        if ($dataType === 'integer') {
            $propertyValue = (integer)$propertyValue;
        }

        // Serialize boolean values to String
        if ($dataType === 'boolean') {
            return (bool) $propertyValue;
        }

        // Serialize array values to String
        if ($dataType === 'array') {
            return $propertyValue;
        }

        // Serialize date values to String
        if ($dataType === 'DateTime') {
            if (!$propertyValue instanceof \DateTimeInterface) {
                return '';
            }
            $value = clone $propertyValue;
            return $value->setTimezone(new \DateTimeZone('UTC'))->format(\DateTime::W3C);
        }

        // Serialize node references to node identifiers
        if ($dataType === 'references') {
            $nodeIdentifiers = array();
            if (is_array($propertyValue)) {
                /** @var $subNode NodeInterface */
                foreach ($propertyValue as $subNode) {
                    $nodeIdentifiers[] = $subNode->getIdentifier();
                }
            }
            return $nodeIdentifiers;
        }

        // Serialize node reference to node identifier
        if ($dataType === 'reference') {
            if ($propertyValue instanceof NodeInterface) {
                return $propertyValue->getIdentifier();
            } else {
                return '';
            }
        }

        if ($propertyValue instanceof ImageInterface) {
            $propertyMappingConfiguration = new PropertyMappingConfiguration();
            return $this->entityToIdentityConverter->convertFrom($propertyValue, 'array', array(), $propertyMappingConfiguration);
        }

        // Serialize an Asset to JSON (the NodeConverter expects JSON for object type properties)
        if ($dataType === ltrim('Neos\Media\Domain\Model\Asset', '\\') && $propertyValue !== null) {
            if ($propertyValue instanceof Asset) {
                return $this->persistenceManager->getIdentifierByObject($propertyValue);
            }
        }

        // Serialize an array of Assets to JSON
        if (is_array($propertyValue)) {
            $parsedType = TypeHandling::parseType($dataType);
            if ($parsedType['elementType'] === ltrim('Neos\Media\Domain\Model\Asset', '\\')) {
                $convertedValues = array();
                foreach ($propertyValue as $singlePropertyValue) {
                    if ($singlePropertyValue instanceof Asset) {
                        $convertedValues[] = $this->persistenceManager->getIdentifierByObject($singlePropertyValue);
                    }
                }
                return $convertedValues;
            }
        }
        return $propertyValue === null ? '' : $propertyValue;
    }
}
