<?php
namespace Neos\Neos\Ui\TypeConverter;

/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

use Neos\ContentRepository\Core\Factory\ContentRepositoryIdentifier;
use Neos\Error\Messages\Error;
use Neos\Flow\Annotations as Flow;
use Neos\Flow\ObjectManagement\ObjectManagerInterface;
use Neos\Flow\Persistence\PersistenceManagerInterface;
use Neos\Flow\Property\PropertyMapper;
use Neos\Flow\Property\PropertyMappingConfigurationInterface;
use Neos\Flow\Property\TypeConverter\AbstractTypeConverter;
use Neos\Flow\Reflection\ReflectionService;
use Neos\Neos\Ui\ContentRepository\Service\NodeService;
use Neos\Neos\Ui\Domain\Model\ChangeCollection;
use Neos\Neos\Ui\Domain\Model\ChangeInterface;
use Neos\Neos\Ui\Domain\Model\Changes\Property;
use Neos\Utility\ObjectAccess;

/**
 * An Object Converter for ChangeCollections.
 *
 * @Flow\Scope("singleton")
 */
class ChangeCollectionConverter
{
    /**
     * @var array<int,string>
     */
    protected $sourceTypes = ['array'];

    /**
     * @var string
     */
    protected $targetType = ChangeCollection::class;

    /**
     * @var integer
     */
    protected $priority = 5;

    /**
     * @Flow\Inject
     * @var PersistenceManagerInterface
     */
    protected $persistenceManager;

    /**
     * @var array<int,string>
     */
    protected array $disallowedPayloadProperties = [
        'subject',
        'reference'
    ];

    /**
     * @Flow\InjectConfiguration(package="Neos.Neos.Ui", path="changes.types")
     * @var array<string,string>
     */
    protected array $typeMap;

    /**
     * @Flow\Inject
     * @var ObjectManagerInterface
     */
    protected $objectManager;

    /**
     * @Flow\Inject
     * @var NodeService
     */
    protected $nodeService;

    /**
     * @Flow\Inject
     * @var PropertyMapper
     */
    protected $propertyMapper;

    /**
     * @Flow\Inject
     * @var ReflectionService
     */
    protected $reflectionService;

    /**
     * Converts a accordingly formatted, associative array to a change collection
     *
     * @param array<int,array<string,mixed>> $source
     * @param string $targetType not used
     * @param array<string,mixed> $subProperties not used
     * @param PropertyMappingConfigurationInterface $configuration not used
     * @return ChangeCollection|Error An object or \Neos\Error\Messages\Error if the input format is not supported
     *               or could not be converted for other reasons
     * @throws \Exception
     */
    public function convert(
        array $source,
        ContentRepositoryIdentifier $contentRepositoryIdentifier
    ): ChangeCollection {
        if (!is_array($source)) {
            throw new \RuntimeException(sprintf('Cannot convert %s to ChangeCollection.', gettype($source)));
        }

        $changeCollection = new ChangeCollection();
        foreach ($source as $changeData) {
            $convertedData = $this->convertChangeData($changeData, $contentRepositoryIdentifier);

            $changeCollection->add($convertedData);
        }

        return $changeCollection;
    }

    /**
     * Convert array to change interface
     *
     * @param array<string,mixed> $changeData
     */
    protected function convertChangeData(array $changeData, ContentRepositoryIdentifier $contentRepositoryIdentifier): ChangeInterface
    {
        $type = $changeData['type'];

        if (!isset($this->typeMap[$type])) {
            throw new \RuntimeException(sprintf('Could not convert change type %s, it is unknown to the system', $type));
        }

        $changeClass = $this->typeMap[$type];
        /** @var ChangeInterface $changeClassInstance */
        $changeClassInstance = $this->objectManager->get($changeClass);



        $subjectContextPath = $changeData['subject'];
        $subject = $this->nodeService->getNodeFromContextPath($subjectContextPath, $contentRepositoryIdentifier);
        if (is_null($subject)) {
            throw new \RuntimeException('Could not find node for subject "' . $subjectContextPath . '"', 1645657340);
        }

        $changeClassInstance->setSubject($subject);

        if (isset($changeData['reference']) && method_exists($changeClassInstance, 'setReference')) {
            $referenceContextPath = $changeData['reference'];
            $reference = $this->nodeService->getNodeFromContextPath($referenceContextPath, $contentRepositoryIdentifier);
            $changeClassInstance->setReference($reference);
        }

        if (isset($changeData['payload'])) {
            foreach ($changeData['payload'] as $propertyName => $value) {
                if (!in_array($propertyName, $this->disallowedPayloadProperties)) {
                    $methodParameters = $this->reflectionService->getMethodParameters(
                        $changeClass,
                        ObjectAccess::buildSetterMethodName($propertyName)
                    );
                    $methodParameter = current($methodParameters);
                    $targetType = $methodParameter['type'];

                    // Fixme: The type conversion runs depending on the target node property type inside Property::class
                    // This is why we are not allowed to modify the value in any way.
                    // Without this condition the object was parsed to a string leading to fatal errors
                    // when changing images in the UI.
                    if ($propertyName !== 'value' && $targetType !== Property::class) {
                        $value = $this->propertyMapper->convert($value, $targetType);
                    }

                    ObjectAccess::setProperty($changeClassInstance, $propertyName, $value);
                }
            }
        }

        return $changeClassInstance;
    }
}
