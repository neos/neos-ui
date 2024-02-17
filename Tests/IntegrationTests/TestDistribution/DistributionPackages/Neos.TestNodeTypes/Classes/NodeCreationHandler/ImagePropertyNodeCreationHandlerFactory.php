<?php

declare(strict_types=1);

namespace Neos\TestNodeTypes\NodeCreationHandler;

use Neos\ContentRepository\Core\Factory\ContentRepositoryServiceFactoryDependencies;
use Neos\ContentRepository\Core\Factory\ContentRepositoryServiceFactoryInterface;
use Neos\Flow\Annotations as Flow;
use Neos\Flow\Property\PropertyMapper;
use Neos\Flow\Property\TypeConverter\PersistentObjectConverter;
use Neos\Media\Domain\Model\ImageInterface;
use Neos\Neos\Ui\NodeCreationHandler\NodeCreationCommands;
use Neos\Neos\Ui\NodeCreationHandler\NodeCreationHandlerInterface;

/**
 * @implements ContentRepositoryServiceFactoryInterface<NodeCreationHandlerInterface>
 */
final class ImagePropertyNodeCreationHandlerFactory implements ContentRepositoryServiceFactoryInterface
{
    /**
     * @Flow\Inject
     */
    protected PropertyMapper $propertyMapper;

    public function build(ContentRepositoryServiceFactoryDependencies $serviceFactoryDependencies): NodeCreationHandlerInterface
    {
        return new class ($this->propertyMapper) implements NodeCreationHandlerInterface
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
        };
    }
}
