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

use Neos\ContentRepository\Core\Feature\SubtreeTagging\Dto\SubtreeTag;
use Neos\ContentRepository\Core\NodeType\NodeType;
use Neos\ContentRepository\Core\Projection\ContentGraph\Filter\FindReferencesFilter;
use Neos\ContentRepository\Core\Projection\ContentGraph\Node;
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
use Neos\Neos\Utility\NodeTypeWithFallbackProvider;
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
 * @internal
 */
class NodePropertyConverterService
{
    use NodeTypeWithFallbackProvider;

    #[Flow\Inject]
    protected ContentRepositoryRegistry $contentRepositoryRegistry;

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
     * @return list<string>|string|null
     */
    private function getReference(Node $node, string $referenceName): array|string|null
    {
        $subgraph = $this->contentRepositoryRegistry->subgraphForNode($node);
        $references = $subgraph->findReferences(
            $node->nodeAggregateId,
            FindReferencesFilter::create(referenceName: $referenceName)
        );

        $referenceIdentifiers = [];
        foreach ($references as $reference) {
            $referenceIdentifiers[] = $reference->node->nodeAggregateId->value;
        }

        $maxItems = $this->getNodeType($node)->getReferences()[$referenceName]['constraints']['maxItems'] ?? null;

        if ($maxItems === 1) {
            // special handling to simulate old single reference behaviour.
            // todo should be adjusted in the ui
            if (count($referenceIdentifiers) === 0) {
                return null;
            } else {
                return reset($referenceIdentifiers);
            }
        }
        return $referenceIdentifiers;
    }

    /**
     * Get a single property reduced to a simple type (no objects) representation
     */
    private function getProperty(Node $node, string $propertyName): mixed
    {
        if ($propertyName === '_hidden') {
            return $node->tags->contain(SubtreeTag::fromString('disabled'));
        }

        $propertyValue = $node->getProperty($propertyName);
        $propertyType = $this->getNodeType($node)->getPropertyType($propertyName);
        try {
            $convertedValue = $this->convertValue($propertyValue, $propertyType);
        } catch (PropertyException $exception) {
            $logMessage = $this->throwableStorage->logThrowable($exception);
            $this->logger->error($logMessage, LogEnvironment::fromMethodName(__METHOD__));
            $convertedValue = null;
        }

        if ($convertedValue === null) {
            $convertedValue = $this->getDefaultValueForProperty($this->getNodeType($node), $propertyName);
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
     * Get all properties and references stuff reduced to simple type (no objects) representations in an array
     *
     * @param Node $node
     * @return array<string,mixed>
     */
    public function getPropertiesArray(Node $node)
    {
        $properties = [];
        foreach ($this->getNodeType($node)->getProperties() as $propertyName => $_) {
            if ($propertyName[0] === '_' && $propertyName[1] === '_') {
                // skip fully-private properties
                continue;
            }

            $properties[$propertyName] = $this->getProperty($node, $propertyName);
        }
        foreach ($this->getNodeType($node)->getReferences() as $referenceName => $_) {
            $properties[$referenceName] = $this->getReference($node, $referenceName);
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

            $parsedType = TypeHandling::parseType($dataType);

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
