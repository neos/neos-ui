<?php
namespace Neos\Neos\Ui\NodeCreationHandler;

/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

use Neos\ContentRepository\Core\ContentRepository;
use Neos\ContentRepository\Core\SharedModel\NodeType\NodeTypeManager;
use Neos\ContentRepository\Core\Feature\NodeCreation\Command\CreateNodeAggregateWithNode;
use Neos\Flow\Annotations as Flow;
use Neos\Flow\Property\PropertyMapper;
use Neos\Flow\Property\TypeConverter\PersistentObjectConverter;
use Neos\Utility\TypeHandling;

/**
 * Generic creation dialog node creation handler that iterates
 * properties that are configured to appear in the Creation Dialog (via "ui.showInCreationDialog" setting)
 * and sets the initial property values accordingly
 */
class CreationDialogPropertiesCreationHandler implements NodeCreationHandlerInterface
{
    /**
     * @Flow\Inject
     * @var PropertyMapper
     */
    protected $propertyMapper;

    /**
     * @param array<string|int,mixed> $data
     */
    public function handle(CreateNodeAggregateWithNode $command, array $data, ContentRepository $contentRepository): CreateNodeAggregateWithNode
    {
        $propertyMappingConfiguration = $this->propertyMapper->buildPropertyMappingConfiguration();
        $propertyMappingConfiguration->forProperty('*')->allowAllProperties();
        $propertyMappingConfiguration->setTypeConverterOption(PersistentObjectConverter::class, PersistentObjectConverter::CONFIGURATION_OVERRIDE_TARGET_TYPE_ALLOWED, true);

        $nodeType = $contentRepository->getNodeTypeManager()->getNodeType($command->nodeTypeName->getValue());
        $propertyValues = $command->initialPropertyValues;
        foreach ($nodeType->getConfiguration('properties') as $propertyName => $propertyConfiguration) {
            if (
                !isset($propertyConfiguration['ui']['showInCreationDialog'])
                || $propertyConfiguration['ui']['showInCreationDialog'] !== true
            ) {
                continue;
            }
            $propertyType = TypeHandling::normalizeType($propertyConfiguration['type'] ?? 'string');
            if (!isset($data[$propertyName])) {
                continue;
            }
            $propertyValue = $data[$propertyName];
            if ($propertyType !== 'references' && $propertyType !== 'reference' && $propertyType !== TypeHandling::getTypeForValue($propertyValue)) {
                $propertyValue = $this->propertyMapper->convert($propertyValue, $propertyType, $propertyMappingConfiguration);
            }

            $propertyValues = $propertyValues->withValue($propertyName, $propertyValue);
        }

        return $command->withInitialPropertyValues($propertyValues);
    }
}
