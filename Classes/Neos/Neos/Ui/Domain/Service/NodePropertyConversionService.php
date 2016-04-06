<?php
namespace Neos\Neos\Ui\Domain\Service;

use TYPO3\Flow\Annotations as Flow;
use TYPO3\Flow\Object\ObjectManagerInterface;
use TYPO3\Flow\Property\PropertyMapper;
use TYPO3\TYPO3CR\Domain\Service\Context;
use TYPO3\TYPO3CR\Domain\Model\NodeType;
use TYPO3\TYPO3CR\Domain\Model\NodeInterface;

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
                return $this->convertDateTime($rawValue);

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
                        $parsedType = \TYPO3\Flow\Utility\TypeHandling::parseType($propertyType);
                        $innerType = $parsedType['elementType'] ?: $parsedType['type'];
                    } catch (\TYPO3\Flow\Utility\Exception\InvalidTypeException $exception) {
                    }
                }

                if (is_string($rawValue) && $this->objectManager->isRegistered($innerType) && $rawValue !== '') {
                    return $this->propertyMapper->convert(json_decode($rawValue, true), $propertyType);
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
        return $context->getNodeByIdentifier($nodePropertyValue);
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
        $nodeIdentifiers = json_decode($rawValue);
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
     * @return integer
     */
    protected function convertInteger($rawValue)
    {
        return (int) $rawValue;
    }

    /**
     * Convert raw value to boolean
     *
     * @param mixed $rawValue
     * @return boolean
     */
    protected function convertBoolean($rawValue)
    {
        if (is_string($rawValue)) {
            return strtolower($rawValue) === 'true' ? true : false;
        }

        return (bool) $rawValue;
    }

    /**
     * Convert raw value to array
     *
     * @param string $rawValue
     * @return array
     */
    protected function convertArray($rawValue)
    {
        return json_decode($rawValue, true);
    }
}
