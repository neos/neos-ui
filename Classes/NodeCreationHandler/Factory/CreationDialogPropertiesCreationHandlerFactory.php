<?php

declare(strict_types=1);

namespace Neos\Neos\Ui\NodeCreationHandler\Factory;

use Neos\ContentRepository\Core\Factory\ContentRepositoryServiceFactoryDependencies;
use Neos\ContentRepository\Core\Factory\ContentRepositoryServiceFactoryInterface;
use Neos\ContentRepository\Core\Factory\ContentRepositoryServiceInterface;
use Neos\Flow\Annotations as Flow;
use Neos\Flow\Property\PropertyMapper;
use Neos\Neos\Ui\NodeCreationHandler\ContentTitleNodeCreationHandler;
use Neos\Neos\Ui\NodeCreationHandler\CreationDialogPropertiesCreationHandler;

/**
 * @implements ContentRepositoryServiceFactoryInterface<CreationDialogPropertiesCreationHandler>
 */
final class CreationDialogPropertiesCreationHandlerFactory implements ContentRepositoryServiceFactoryInterface
{
    /**
     * @Flow\Inject
     */
    protected PropertyMapper $propertyMapper;

    public function build(ContentRepositoryServiceFactoryDependencies $serviceFactoryDependencies): ContentRepositoryServiceInterface
    {
        return new CreationDialogPropertiesCreationHandler($serviceFactoryDependencies->contentRepository, $this->propertyMapper);
    }
}
