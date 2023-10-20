<?php
namespace Neos\TestNodeTypes\NodeCreationHandler;

/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

use Neos\Flow\Property\PropertyMapper;
use Neos\Flow\Property\TypeConverter\PersistentObjectConverter;
use Neos\Media\Domain\Model\ImageInterface;
use Neos\Neos\Ui\NodeCreationHandler\NodeCreationCommands;
use Neos\Neos\Ui\NodeCreationHandler\NodeCreationHandlerInterface;

class ImagePropertyNodeCreationHandler implements NodeCreationHandlerInterface
{
    public function __construct(
        private PropertyMapper $propertyMapper
    ) {
    }

    public function handle(NodeCreationCommands $commands, array $data): NodeCreationCommands
    {
        if (!isset($data['image'])) {
            return $commands;
        }
        $propertyMappingConfiguration = $this->propertyMapper->buildPropertyMappingConfiguration();
        $propertyMappingConfiguration->forProperty('*')->allowAllProperties();
        $propertyMappingConfiguration->setTypeConverterOption(PersistentObjectConverter::class, PersistentObjectConverter::CONFIGURATION_OVERRIDE_TARGET_TYPE_ALLOWED, true);
        $image = $this->propertyMapper->convert($data['image'], ImageInterface::class, $propertyMappingConfiguration);

        $propertyValues = $commands->first->initialPropertyValues->withValue('image', $image);
        return $commands->withInitialPropertyValues($propertyValues);
    }
}
