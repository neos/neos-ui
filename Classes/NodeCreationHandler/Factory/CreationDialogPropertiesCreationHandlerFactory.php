<?php

declare(strict_types=1);

namespace Neos\Neos\Ui\NodeCreationHandler\Factory;

use Neos\ContentRepository\Core\ContentRepository;
use Neos\ContentRepository\Core\Factory\ContentRepositoryServiceFactoryDependencies;
use Neos\ContentRepository\Core\Factory\ContentRepositoryServiceFactoryInterface;
use Neos\Flow\Annotations as Flow;
use Neos\Flow\Property\PropertyMapper;
use Neos\Flow\Property\TypeConverter\PersistentObjectConverter;
use Neos\Neos\Ui\NodeCreationHandler\NodeCreationCommands;
use Neos\Neos\Ui\NodeCreationHandler\NodeCreationHandlerInterface;
use Neos\Utility\TypeHandling;

/**
 * Generic creation dialog node creation handler that iterates
 * properties that are configured to appear in the Creation Dialog (via "ui.showInCreationDialog" setting)
 * and sets the initial property values accordingly
 *
 * @internal you should not to interact with this factory directly. The node creation handle will already be configured under `nodeCreationHandlers`
 * @implements ContentRepositoryServiceFactoryInterface<NodeCreationHandlerInterface>
 */
final class CreationDialogPropertiesCreationHandlerFactory implements ContentRepositoryServiceFactoryInterface
{
    /**
     * @Flow\Inject
     */
    protected PropertyMapper $propertyMapper;

    public function build(ContentRepositoryServiceFactoryDependencies $serviceFactoryDependencies): NodeCreationHandlerInterface
    {
        return new class($serviceFactoryDependencies->contentRepository, $this->propertyMapper) implements NodeCreationHandlerInterface
        {
            public function __construct(
                private readonly ContentRepository $contentRepository,
                private readonly PropertyMapper $propertyMapper
            ) {
            }

            /**
             * @param array<string|int,mixed> $data
             */
            public function handle(NodeCreationCommands $commands, array $data): NodeCreationCommands
            {
                $propertyMappingConfiguration = $this->propertyMapper->buildPropertyMappingConfiguration();
                $propertyMappingConfiguration->forProperty('*')->allowAllProperties();
                $propertyMappingConfiguration->setTypeConverterOption(PersistentObjectConverter::class, PersistentObjectConverter::CONFIGURATION_OVERRIDE_TARGET_TYPE_ALLOWED, true);

                $nodeType = $this->contentRepository->getNodeTypeManager()->getNodeType($commands->first->nodeTypeName);
                $propertyValues = $commands->first->initialPropertyValues;
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

                return $commands->withInitialPropertyValues($propertyValues);
            }
        };
    }
}
