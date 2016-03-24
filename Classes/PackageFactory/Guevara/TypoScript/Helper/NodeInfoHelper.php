<?php
namespace PackageFactory\Guevara\TypoScript\Helper;

use TYPO3\Flow\Annotations as Flow;
use TYPO3\Eel\ProtectedContextAwareInterface;
use TYPO3\Flow\Mvc\Controller\ControllerContext;
use TYPO3\Flow\Persistence\PersistenceManagerInterface;
use TYPO3\Flow\Reflection\ObjectAccess;
use TYPO3\Neos\Domain\Service\ContentContext;
use TYPO3\Neos\Service\LinkingService;
use TYPO3\Neos\TypeConverter\EntityToIdentityConverter;
use TYPO3\TYPO3CR\Domain\Model\Node;
use TYPO3\TYPO3CR\Domain\Model\NodeInterface;

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

    private function renderNode(NodeInterface $node, ControllerContext $controllerContext)
    {
        $nodeInfo = [
            'contextPath' => $node->getContextPath(),
            'name' => $node->getName(),
            'identifier' => $node->getIdentifier(),
            'nodeType' => $node->getNodeType()->getName(),
            'properties' => $this->buildNodeProperties($node),
            'label' => $node->getLabel(),
            'isAutoCreated' => $node->isAutoCreated(),
            // TODO: 'uri' =>@if.onyRenderWhenNodeIsADocument = ${q(node).is('[instanceof TYPO3.Neos:Document]')}
            'children' => [],
        ];
        if ($node->getNodeType()->isOfType('TYPO3.Neos:Document')) {
            $nodeInfo['uri'] = $this->uri($node, $controllerContext);
        }

        foreach ($node->getChildNodes() as $childNode) {
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

    public function renderDocumentNodeAndChildContent(NodeInterface $documentNode, ControllerContext $controllerContext)
    {
        $nodes = [];
        $this->renderDocumentNodeAndChildContentInternal($nodes, $documentNode, $controllerContext);
        return $nodes;
    }

    protected function renderDocumentNodeAndChildContentInternal(array &$nodes, NodeInterface $node, ControllerContext $controllerContext)
    {
        $this->renderNodeToList($nodes, $node, $controllerContext);
        foreach ($node->getChildNodes('!TYPO3.Neos:Document') as $childNode) {
            $this->renderDocumentNodeAndChildContentInternal($nodes, $childNode, $controllerContext);
        }
    }

    public function defaultNodesForBackend(NodeInterface $site, NodeInterface $documentNode, ControllerContext $controllerContext)
    {
        $nodes = [];
        if ($site !== $documentNode) {
            $this->renderNodeToList($nodes, $site, $controllerContext);
        }
        foreach ($site->getChildNodes('TYPO3.Neos:Document') as $documentChildNodeInFirstLevel) {
            $this->renderNodeToList($nodes, $documentChildNodeInFirstLevel, $controllerContext);
        }

        $this->renderNodeToList($nodes, $documentNode, $controllerContext);

        return $nodes;
    }

    public function uri(NodeInterface $node, ControllerContext $controllerContext)
    {
        return $this->linkingService->createNodeUri($controllerContext, $node);
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
            // Serialize objects to JSON strings
            $dataType = isset($propertyConfiguration['type']) ? $propertyConfiguration['type'] : 'string';
            $encodedProperties[$propertyName] = $this->buildNodeProperty($node, $propertyName, $dataType);
        }

        return $encodedProperties;
    }

    private function buildNodeProperty(NodeInterface $node, $propertyName, $dataType)
    {
        if (substr($propertyName, 0, 1) === '_') {
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
            return $propertyValue ? 'true' : 'false';
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

        if ($propertyValue instanceof \TYPO3\Media\Domain\Model\ImageInterface) {
            $propertyMappingConfiguration = new \TYPO3\Flow\Property\PropertyMappingConfiguration();
            return $this->entityToIdentityConverter->convertFrom($propertyValue, 'array', array(), $propertyMappingConfiguration);
        }

        // Serialize an Asset to JSON (the NodeConverter expects JSON for object type properties)
        if ($dataType === ltrim('TYPO3\Media\Domain\Model\Asset', '\\') && $propertyValue !== null) {
            if ($propertyValue instanceof \TYPO3\Media\Domain\Model\Asset) {
                return $this->persistenceManager->getIdentifierByObject($propertyValue);
            }
        }

        // Serialize an array of Assets to JSON
        if (is_array($propertyValue)) {
            $parsedType = \TYPO3\Flow\Utility\TypeHandling::parseType($dataType);
            if ($parsedType['elementType'] === ltrim('TYPO3\Media\Domain\Model\Asset', '\\')) {
                $convertedValues = array();
                foreach ($propertyValue as $singlePropertyValue) {
                    if ($singlePropertyValue instanceof \TYPO3\Media\Domain\Model\Asset) {
                        $convertedValues[] = $this->persistenceManager->getIdentifierByObject($singlePropertyValue);
                    }
                }
                return $convertedValues;
            }
        }
        return $propertyValue === null ? '' : $propertyValue;
    }
}
