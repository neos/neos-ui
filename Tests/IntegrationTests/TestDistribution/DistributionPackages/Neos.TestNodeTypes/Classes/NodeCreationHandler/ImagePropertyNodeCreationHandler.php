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

use Neos\ContentRepository\Core\ContentRepository;
use Neos\ContentRepository\Core\Feature\NodeCreation\Command\CreateNodeAggregateWithNode;
use Neos\Flow\Annotations as Flow;
use Neos\Flow\Property\PropertyMapper;
use Neos\Flow\Property\TypeConverter\PersistentObjectConverter;
use Neos\Media\Domain\Model\ImageInterface;
use Neos\Neos\Ui\NodeCreationHandler\NodeCreationHandlerInterface;

class ImagePropertyNodeCreationHandler implements NodeCreationHandlerInterface
{
    /**
     * @Flow\Inject
     * @var PropertyMapper
     */
    protected $propertyMapper;

    public function handle(CreateNodeAggregateWithNode $command, array $data, ContentRepository $contentRepository): CreateNodeAggregateWithNode
    {
        if (!isset($data['image'])) {
            return $command;
        }
        $propertyMappingConfiguration = $this->propertyMapper->buildPropertyMappingConfiguration();
        $propertyMappingConfiguration->forProperty('*')->allowAllProperties();
        $propertyMappingConfiguration->setTypeConverterOption(PersistentObjectConverter::class, PersistentObjectConverter::CONFIGURATION_OVERRIDE_TARGET_TYPE_ALLOWED, true);
        $image = $this->propertyMapper->convert($data['image'], ImageInterface::class, $propertyMappingConfiguration);

        $propertyValues = $command->initialPropertyValues->withValue('image', $image);
        return $command->withInitialPropertyValues($propertyValues);
    }
}
