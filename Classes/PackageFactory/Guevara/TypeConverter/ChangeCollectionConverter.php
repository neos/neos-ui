<?php
namespace PackageFactory\Guevara\TypeConverter;

/*
 * This file is part of the TYPO3.TYPO3CR package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

use TYPO3\Flow\Annotations as Flow;
use TYPO3\Flow\Property\TypeConverter\AbstractTypeConverter;
use TYPO3\Flow\Property\PropertyMappingConfigurationInterface;
use TYPO3\Flow\Object\ObjectManagerInterface;
use TYPO3\Flow\Reflection\ObjectAccess;
use TYPO3\TYPO3CR\Domain\Model\NodeInterface;
use TYPO3\TYPO3CR\Domain\Utility\NodePaths;
use TYPO3\TYPO3CR\Domain\Service\ContextFactoryInterface;
use PackageFactory\Guevara\Domain\Model\ChangeCollection;
use PackageFactory\Guevara\Domain\Model\ChangeInterface;

/**
 * An Object Converter for ChangeCollections.
 *
 * @Flow\Scope("singleton")
 */
class ChangeCollectionConverter extends AbstractTypeConverter
{
    /**
     * @var array
     */
    protected $sourceTypes = ['array'];

    /**
     * @var string
     */
    protected $targetType = ChangeCollection::class;

    /**
     * @var integer
     */
    protected $priority = 1;

    protected $disallowedPayloadProperties = [
        'subject',
        'reference'
    ];

    /**
     * @Flow\InjectConfiguration(path="changes.types")
     * @var array
     */
    protected $typeMap;

    /**
     * @Flow\Inject
     * @var ObjectManagerInterface
     */
    protected $objectManager;

    /**
     * @Flow\Inject
     * @var ContextFactoryInterface
     */
    protected $contextFactory;

    /**
     * Converts a accordingly formatted, associative array to a change collection
     *
     * @param array $source
     * @param string $targetType not used
     * @param array $subProperties not used
     * @param \TYPO3\Flow\Property\PropertyMappingConfigurationInterface $configuration not used
     * @return mixed An object or \TYPO3\Flow\Error\Error if the input format is not supported or could not be converted for other reasons
     * @throws \Exception
     */
    public function convertFrom($source, $targetType, array $subProperties = array(), PropertyMappingConfigurationInterface $configuration = null)
    {
        if (!is_array($source)) {
            return new \TYPO3\Flow\Error\Error(sprintf('Cannot convert %s to ChangeCollection.',
                gettype($source)));
        }

        $changeCollection = new ChangeCollection();

        foreach ($source as $changeData) {
            $convertedData = $this->convertChangeData($changeData);

            if ($convertedData instanceof \TYPO3\Flow\Error\Error) {
                return $convertedData;
            }

            $changeCollection->add($convertedData);
        }

        return $changeCollection;
    }

    /**
     * Convert array to change interface
     *
     * @param array $changeData
     * @return ChangeInterface
     */
    protected function convertChangeData($changeData)
    {
        $type = $changeData['type'];

        if (!isset($this->typeMap[$type])) {
            return new \TYPO3\Flow\Error\Error(
              sprintf('Could not convert change type %s, it is unknown to the system', $type));
        }

        $changeClass = $this->typeMap[$type];
        $changeClassInstance = $this->objectManager->get($changeClass);

        $subjectContextPath = $changeData['subject'];
        $subject = $this->getNodeFromContextPath($subjectContextPath);

        if ($subject instanceof \TYPO3\Flow\Error\Error) {
            return $subject;
        }

        $changeClassInstance->setSubject($subject);

        if (isset($changeData['reference']) && method_exists($changeClassInstance, 'setReference')) {
            $referenceContextPath = $changeData['reference'];
            $reference = $this->getNodeFromContextPath($referenceContextPath);

            if ($reference instanceof \TYPO3\Flow\Error\Error) {
                return $reference;
            }

            $changeClassInstance->setReference($reference);
        }

        if (isset($changeData['payload'])) {
            foreach ($changeData['payload'] as $key => $value) {
                if (!in_array($key, $this->disallowedPayloadProperties)) {
                    ObjectAccess::setProperty($changeClassInstance, $key, $value);
                }
            }
        }

        return $changeClassInstance;
    }

    /**
     * Converts a given context path to a node object
     *
     * @param string $contextPath
     * @return NodeInterface
     */
    protected function getNodeFromContextPath($contextPath)
    {
        $nodePathAndContext = NodePaths::explodeContextPath($contextPath);
        $nodePath = $nodePathAndContext['nodePath'];
        $workspaceName = $nodePathAndContext['workspaceName'];
        $dimensions = $nodePathAndContext['dimensions'];

        $context = $this->contextFactory->create(
            $this->prepareContextProperties($workspaceName, $dimensions)
        );

        $workspace = $context->getWorkspace(false);
        if (!$workspace) {
            return new \TYPO3\Flow\Error\Error(
                sprintf('Could not convert the given source to Node object because the workspace "%s" as specified in the context node path does not exist.', $workspaceName), 1451392329);
        }

        return $context->getNode($nodePath);
    }

    /**
     * Prepares the context properties for the nodes based on the given workspace and dimensions
     *
     * @param string $workspaceName
     * @param array $dimensions
     * @return array
     */
    protected function prepareContextProperties($workspaceName, array $dimensions = null)
    {
        $contextProperties = array(
            'workspaceName' => $workspaceName,
            'invisibleContentShown' => false,
            'removedContentShown' => false
        );

        if ($workspaceName !== 'live') {
            $contextProperties['invisibleContentShown'] = true;
        }

        if ($dimensions !== null) {
            $contextProperties['dimensions'] = $dimensions;
        }

        return $contextProperties;
    }
}
