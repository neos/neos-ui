<?php

declare(strict_types=1);

namespace Neos\TestNodeTypes\NodeCreationHandler;

use Neos\ContentRepository\Core\Factory\ContentRepositoryServiceFactoryDependencies;
use Neos\ContentRepository\Core\Factory\ContentRepositoryServiceFactoryInterface;
use Neos\ContentRepository\Core\Factory\ContentRepositoryServiceInterface;
use Neos\Flow\Annotations as Flow;
use Neos\Flow\Property\PropertyMapper;
use Neos\TestNodeTypes\NodeCreationHandler\ImagePropertyNodeCreationHandler;

/**
 * @implements ContentRepositoryServiceFactoryInterface<ImagePropertyNodeCreationHandler>
 */
final class ImagePropertyNodeCreationHandlerFactory implements ContentRepositoryServiceFactoryInterface
{
    /**
     * @Flow\Inject
     */
    protected PropertyMapper $propertyMapper;

    public function build(ContentRepositoryServiceFactoryDependencies $serviceFactoryDependencies): ContentRepositoryServiceInterface
    {
        return new ImagePropertyNodeCreationHandler($this->propertyMapper);
    }
}
