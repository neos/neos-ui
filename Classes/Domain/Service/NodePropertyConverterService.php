<?php

/*
 * This file is part of the Neos.Neos package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

declare(strict_types=1);

namespace Neos\Neos\Ui\Domain\Service;

use Neos\ContentRepository\Core\NodeType\NodeType;
use Neos\ContentRepository\Core\Projection\ContentGraph\Filter\FindReferencesFilter;
use Neos\ContentRepository\Core\Projection\ContentGraph\Node;
use Neos\ContentRepository\Core\Projection\ContentGraph\Reference;
use Neos\ContentRepository\Core\Projection\ContentGraph\References;
use Neos\ContentRepository\Core\Projection\NodeHiddenState\NodeHiddenStateFinder;
use Neos\ContentRepositoryRegistry\ContentRepositoryRegistry;
use Neos\Flow\Annotations as Flow;
use Neos\Flow\Log\ThrowableStorageInterface;
use Neos\Flow\Log\Utility\LogEnvironment;
use Neos\Flow\ObjectManagement\ObjectManagerInterface;
use Neos\Flow\Property\Exception as PropertyException;
use Neos\Flow\Property\PropertyMapper;
use Neos\Flow\Property\PropertyMappingConfiguration;
use Neos\Flow\Property\PropertyMappingConfigurationInterface;
use Neos\Flow\Property\TypeConverterInterface;
use Neos\Utility\ObjectAccess;
use Neos\Utility\TypeHandling;
use Psr\Log\LoggerInterface;

/**
 * Creates PropertyMappingConfigurations to map NodeType properties for the Neos interface.
 *
 * THIS IS DIRTY CODE. In the longer run, the neos UI should work DIRECTLY with serialized properties
 * instead of the objects.
 *
 * @Flow\Scope("singleton")
 */
class NodePropertyConverterService
{
    /**
     * @Flow\InjectConfiguration(package="Neos.Neos", path="userInterface.inspector.dataTypes")
     * @var array<string,array<string,mixed>>
     */
    protected $typesConfiguration;

    /**
     * @Flow\Inject
     * @var ObjectManagerInterface
     */
    protected $objectManager;

    /**
     * @Flow\Inject
     * @var PropertyMapper
     */
    protected $propertyMapper;

    /**
     * @Flow\Transient
     * @var array<string,PropertyMappingConfiguration>
     */
    protected $generatedPropertyMappingConfigurations = [];

    /**
     * @var LoggerInterface
     */
    private $logger;

    /**
     * @var ThrowableStorageInterface
     */
    private $throwableStorage;

    /**
     * @Flow\Inject
     * @var ContentRepositoryRegistry
     */
    protected $contentRepositoryRegistry;

    /**
     * @param LoggerInterface $logger
     */
    public function injectLogger(LoggerInterface $logger): void
    {
        $this->logger = $logger;
    }

    /**
     * @param ThrowableStorageInterface $throwableStorage
     */
    public function injectThrowableStorage(ThrowableStorageInterface $throwableStorage): void
    {
        $this->throwableStorage = $throwableStorage;
    }

    /**
     * Get a single property reduced to a simple type (no objects) representation
     *
     * @param Node $node
     * @param string $propertyName
     * @return mixed
     */
    public function getProperty(Node $node, $propertyName)
    {
        if ($propertyName === '_hidden') {
            $contentRepository = $this->contentRepositoryRegistry->get($node->subgraphIdentity->contentRepositoryId);
            $nodeHiddenStateFinder = $contentRepository->projectionState(NodeHiddenStateFinder::class);

            return $nodeHiddenStateFinder->findHiddenState(
                $node->subgraphIdentity->contentStreamId,
                $node->subgraphIdentity->dimensionSpacePoint,
                $node->nodeAggregateId
            )->isHidden;
        }
        $propertyType = $node->nodeType->getPropertyType($propertyName);

        // We handle "reference" and "references" differently than other properties;
        // because we need to use another API for querying these references.
        if ($propertyType === 'reference') {
            $subgraph = $this->contentRepositoryRegistry->subgraphForNode($node);
            $referenceIdentifiers = $this->toNodeIdentifierStrings(
                $subgraph->findReferences(
                    $node->nodeAggregateId,
                    FindReferencesFilter::referenceName($propertyName)
                )
            );
            if (count($referenceIdentifiers) === 0) {
                return null;
            } else {
                return reset($referenceIdentifiers);
            }
        } elseif ($propertyType === 'references') {
            $subgraph = $this->contentRepositoryRegistry->subgraphForNode($node);
            $references = $subgraph->findReferences(
                $node->nodeAggregateId,
                FindReferencesFilter::referenceName($propertyName)
            );

            return $this->toNodeIdentifierStrings($references);
        // Here, the normal property access logic starts.
        } elseif ($propertyName[0] === '_' && $propertyName !== '_hiddenInIndex') {
            $propertyValue = ObjectAccess::getProperty($node, ltrim($propertyName, '_'));
        } else {
            $propertyValue = $node->getProperty($propertyName);
        }

        try {
            $convertedValue = $this->convertValue($propertyValue, $propertyType);
        } catch (PropertyException $exception) {
            $logMessage = $this->throwableStorage->logThrowable($exception);
            $this->logger->error($logMessage, LogEnvironment::fromMethodName(__METHOD__));
            $convertedValue = null;
        }

        if ($convertedValue === null) {
            $convertedValue = $this->getDefaultValueForProperty($node->nodeType, $propertyName);
            if ($convertedValue !== null) {
                try {
                    $convertedValue = $this->convertValue($convertedValue, $propertyType);
                } catch (PropertyException $exception) {
                    $logMessage = $this->throwableStorage->logThrowable($exception);
                    $this->logger->error($logMessage, LogEnvironment::fromMethodName(__METHOD__));
                    $convertedValue = null;
                }
            }
        }

        return $convertedValue;
    }

    /**
     * @return array<int,string>
     */
    private function toNodeIdentifierStrings(References $references): array
    {
        $identifiers = [];
        foreach ($references as $reference) {
            $identifiers[] = $reference->node->nodeAggregateId->value;
        }
        return $identifiers;
    }

    /**
     * Get all properties reduced to simple type (no objects) representations in an array
     *
     * @param Node $node
     * @return array<string,mixed>
     */
    public function getPropertiesArray(Node $node)
    {
        $properties = [];
        foreach ($node->nodeType->getProperties() as $propertyName => $propertyConfiguration) {
            if ($propertyName[0] === '_' && $propertyName[1] === '_') {
                // skip fully-private properties
                continue;
            }

            $properties[$propertyName] = $this->getProperty($node, $propertyName);
        }

        return $properties;
    }

    /**
     * Convert the given value to a simple type or an array of simple types.
     *
     * @param mixed $propertyValue
     * @param string $dataType
     * @return mixed
     * @throws PropertyException
     */
    protected function convertValue($propertyValue, $dataType)
    {
        $parsedType = TypeHandling::parseType($dataType);

        // This hardcoded handling is to circumvent rewriting PropertyMappers that convert objects.
        // Usually they expect the source to be an object already and break if not.
        if (
            !TypeHandling::isSimpleType($parsedType['type']) && !is_object($propertyValue)
            && !is_array($propertyValue)
        ) {
            return null;
        }

        $conversionTargetType = $parsedType['type'];
        if (!TypeHandling::isSimpleType($parsedType['type'])) {
            $conversionTargetType = 'array';
        }
        // Technically the "string" hardcoded here is irrelevant as the configured type converter wins,
        // but it cannot be the "elementType" because if the source is of the type $elementType
        // then the PropertyMapper skips the type converter.
        if ($parsedType['type'] === 'array' && $parsedType['elementType'] !== null) {
            $conversionTargetType .= '<'
                . (TypeHandling::isSimpleType($parsedType['elementType']) ? $parsedType['elementType'] : 'string')
                . '>';
        }

        $propertyMappingConfiguration = $this->createConfiguration($dataType);
        $convertedValue = $this->propertyMapper->convert(
            $propertyValue,
            $conversionTargetType,
            $propertyMappingConfiguration
        );
        if ($convertedValue instanceof \Neos\Error\Messages\Error) {
            throw new PropertyException($convertedValue->getMessage(), $convertedValue->getCode());
        }

        return $convertedValue;
    }

    /**
     * Tries to find a default value for the given property trying:
     * 1) The specific property configuration for the given NodeType
     * 2) The generic configuration for the property type in settings.
     *
     * @param NodeType $nodeType
     * @param string $propertyName
     * @return mixed
     */
    protected function getDefaultValueForProperty(NodeType $nodeType, $propertyName)
    {
        $defaultValues = $nodeType->getDefaultValuesForProperties();
        if (!isset($defaultValues[$propertyName])) {
            return null;
        }

        return $defaultValues[$propertyName];
    }

    /**
     * Create a property mapping configuration for the given dataType to convert a Node property value
     * from the given dataType to a simple type.
     *
     * @param string $dataType
     * @return PropertyMappingConfigurationInterface
     */
    protected function createConfiguration($dataType)
    {
        if (!isset($this->generatedPropertyMappingConfigurations[$dataType])) {
            $propertyMappingConfiguration = new PropertyMappingConfiguration();
            $propertyMappingConfiguration->allowAllProperties();

            $parsedType = [
                'elementType' => null,
                'type' => $dataType
            ];
            // Special handling for "reference(s)", should be deprecated and normlized to array<Node>
            if ($dataType !== 'references' && $dataType !== 'reference') {
                $parsedType = TypeHandling::parseType($dataType);
            }

            if ($this->setTypeConverterForType($propertyMappingConfiguration, $dataType) === false) {
                $this->setTypeConverterForType($propertyMappingConfiguration, $parsedType['type']);
            }

            $elementConfiguration = $propertyMappingConfiguration->forProperty('*');
            $this->setTypeConverterForType($elementConfiguration, $parsedType['elementType']);

            $this->generatedPropertyMappingConfigurations[$dataType] = $propertyMappingConfiguration;
        }

        return $this->generatedPropertyMappingConfigurations[$dataType];
    }

    protected function setTypeConverterForType(
        PropertyMappingConfiguration $propertyMappingConfiguration,
        string $dataType = null
    ): bool {
        $typeConverterClassName = $this->typesConfiguration[$dataType]['typeConverter'] ?? null;
        if (!is_string($typeConverterClassName)) {
            return false;
        }

        $typeConverter = $this->objectManager->get($typeConverterClassName);
        if (!$typeConverter instanceof TypeConverterInterface) {
            throw new \RuntimeException(
                'Configured class ' . $typeConverterClassName
                    . ' does not implement the required TypeConverterInterface',
                1645557392
            );
        }
        $propertyMappingConfiguration->setTypeConverter($typeConverter);
        if (is_string($dataType)) {
            $this->setTypeConverterOptionsForType(
                $propertyMappingConfiguration,
                $typeConverterClassName,
                $dataType
            );
        }

        return true;
    }

    protected function setTypeConverterOptionsForType(
        PropertyMappingConfiguration $propertyMappingConfiguration,
        string $typeConverterClass,
        string $dataType
    ): void {
        if (
            !isset($this->typesConfiguration[$dataType]['typeConverterOptions'])
            || !is_array($this->typesConfiguration[$dataType]['typeConverterOptions'])
        ) {
            return;
        }

        foreach ($this->typesConfiguration[$dataType]['typeConverterOptions'] as $option => $value) {
            $propertyMappingConfiguration->setTypeConverterOption($typeConverterClass, $option, $value);
        }
    }
}
