<?php
namespace Neos\Neos\Ui\Domain\Service;

/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

use Neos\ContentRepository\Domain\Model\NodeInterface;
use Neos\ContentRepository\Domain\Model\NodeType;
use Neos\ContentRepository\Domain\Service\Context;
use Neos\Flow\Annotations as Flow;
use Neos\Flow\Mvc\Controller\MvcPropertyMappingConfiguration;
use Neos\Flow\ObjectManagement\ObjectManagerInterface;
use Neos\Flow\Property\PropertyMapper;
use Neos\Flow\Property\TypeConverter\PersistentObjectConverter;
use Neos\Neos\Service\Mapping\NodePropertyConverterService;
use Neos\Utility\Exception\InvalidTypeException;
use Neos\Utility\TypeHandling;

/**
 * @Flow\Scope("singleton")
 */
class NodePropertyConversionService
{
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
     * @Flow\Inject
     * @var NodePropertyConverterService
     */
    protected $nodePropertyConverterService;

    /**
     * Convert raw property values to the correct type according to a node type configuration
     *
     * @param NodeType $nodeType
     * @param string $propertyName
     * @param string $rawValue
     * @param Context $context
     * @return mixed
     */
    public function convert(NodeType $nodeType, $propertyName, $rawValue, Context $context)
    {
        $propertyType = $nodeType->getPropertyType($propertyName);

        switch ($propertyType) {
            case 'string':
                return $rawValue;

            case 'reference':
                return $this->convertReference($rawValue, $context);

            case 'references':
                return $this->convertReferences($rawValue, $context);

            case 'DateTime':
                $value = $this->convertDateTime($rawValue);
                if ($value !== null && $this->isDateOnly($nodeType->getProperties()[$propertyName] ?? [])) {
                    // The date picker sends the selected date as UTC midnight
                    $calendarDate = $value->setTimezone(new \DateTimeZone('UTC'))->format('Y-m-d');
                    return new \DateTime($calendarDate . ' 12:00:00', new \DateTimeZone(date_default_timezone_get()));
                }
                return $value;

            case 'integer':
                return $this->convertInteger($rawValue);

            case 'boolean':
                return $this->convertBoolean($rawValue);

            case 'array':
                return $this->convertArray($rawValue);

            default:
                $innerType = $propertyType;
                if ($propertyType !== null) {
                    try {
                        $parsedType = TypeHandling::parseType($propertyType);
                        $innerType = $parsedType['elementType'] ?: $parsedType['type'];
                    } catch (InvalidTypeException $exception) {
                    }
                }

                if ((is_string($rawValue) || is_array($rawValue)) && $this->objectManager->isRegistered($innerType) && $rawValue !== '') {
                    $propertyMappingConfiguration = new MvcPropertyMappingConfiguration();
                    $propertyMappingConfiguration->allowOverrideTargetType();
                    $propertyMappingConfiguration->allowAllProperties();
                    $propertyMappingConfiguration->skipUnknownProperties();
                    $propertyMappingConfiguration->setTypeConverterOption(PersistentObjectConverter::class, PersistentObjectConverter::CONFIGURATION_MODIFICATION_ALLOWED, true);
                    $propertyMappingConfiguration->setTypeConverterOption(PersistentObjectConverter::class, PersistentObjectConverter::CONFIGURATION_CREATION_ALLOWED, true);

                    return $this->propertyMapper->convert($rawValue, $propertyType, $propertyMappingConfiguration);
                } else {
                    return $rawValue;
                }
        }
    }

    /**
     * Convert raw value to reference
     *
     * @param string $rawValue
     * @param Context $context
     * @return NodeInterface
     */
    protected function convertReference($rawValue, Context $context)
    {
        return $context->getNodeByIdentifier($rawValue);
    }

    /**
     * Convert raw value to references
     *
     * @param string $rawValue
     * @param Context $context
     * @return array<NodeInterface>
     */
    protected function convertReferences($rawValue, Context $context)
    {
        $nodeIdentifiers = $rawValue;
        $result = [];

        if (is_array($nodeIdentifiers)) {
            foreach ($nodeIdentifiers as $nodeIdentifier) {
                $referencedNode = $context->getNodeByIdentifier($nodeIdentifier);
                if ($referencedNode !== null) {
                    $result[] = $referencedNode;
                }
            }
        }

        return $result;
    }

    /**
     * Date-only values (see isDateOnly()) represent a calendar date that is the same for every editor, regardless of the
     * browser timezone. They are passed to the UI as UTC midnight of the date in the server timezone, because that is
     * the date the frontend renders. They are persisted as noon in the server timezone (see convert()), which stays on
     * the same date in any timezone up to 12 hours away.
     *
     * @return array<string,mixed>
     */
    public function getPropertiesForUi(NodeInterface $node): array
    {
        $properties = $this->nodePropertyConverterService->getPropertiesArray($node);
        foreach ($node->getNodeType()->getProperties() as $propertyName => $propertyConfiguration) {
            $value = $properties[$propertyName] ?? null;
            if (is_string($value) && $value !== '' && $this->isDateOnly($propertyConfiguration)) {
                $calendarDate = (new \DateTimeImmutable($value))->setTimezone(new \DateTimeZone(date_default_timezone_get()))->format('Y-m-d');
                $properties[$propertyName] = $calendarDate . 'T00:00:00+00:00';
            }
        }
        return $properties;
    }

    /**
     * @param array<string,mixed> $propertyConfiguration
     */
    private function isDateOnly(array $propertyConfiguration): bool
    {
        if (($propertyConfiguration['type'] ?? null) !== 'DateTime' || ($propertyConfiguration['ui']['inspector']['editor'] ?? null) !== 'Neos.Neos/Inspector/Editors/DateTimeEditor') {
            return false;
        }
        $format = $propertyConfiguration['ui']['inspector']['editorOptions']['format'] ?? null;
        // Must match hasTimeFormat() in packages/neos-ui-editors/src/Editors/DateTime/helpers.js
        return is_string($format) && preg_match('/[gGhHis]/', $format) === 0;
    }

    /**
     * Convert raw value to \DateTime
     *
     * @param string $rawValue
     * @return \DateTime|null
     */
    protected function convertDateTime($rawValue)
    {
        if ($rawValue !== '') {
            $result = \DateTime::createFromFormat(\DateTime::W3C, $rawValue);
            $result->setTimezone(new \DateTimeZone(date_default_timezone_get()));

            return $result;
        }
    }

    /**
     * Convert raw value to integer
     *
     * @param mixed $rawValue
     * @return null|integer
     */
    protected function convertInteger($rawValue)
    {
        if (is_numeric($rawValue)) {
            return (int) $rawValue;
        }

        return null;
    }

    /**
     * Convert raw value to boolean
     *
     * @param mixed $rawValue
     * @return boolean
     */
    protected function convertBoolean($rawValue)
    {
        if (is_string($rawValue) && strtolower($rawValue) === 'false') {
            return false;
        }

        return (bool)$rawValue;
    }

    /**
     * Convert raw value to array
     *
     * @param string|array $rawValue
     * @return array
     */
    protected function convertArray($rawValue)
    {
        if (is_string($rawValue)) {
            return json_decode($rawValue, true);
        }

        return $rawValue;
    }
}
