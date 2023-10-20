<?php

declare(strict_types=1);

namespace Neos\Neos\Ui\NodeCreationHandler\Factory;

use Neos\ContentRepository\Core\Factory\ContentRepositoryServiceFactoryDependencies;
use Neos\ContentRepository\Core\Factory\ContentRepositoryServiceFactoryInterface;
use Neos\ContentRepository\Core\Factory\ContentRepositoryServiceInterface;
use Neos\Neos\Ui\NodeCreationHandler\ContentTitleNodeCreationHandler;

/**
 * @implements ContentRepositoryServiceFactoryInterface<ContentTitleNodeCreationHandler>
 */
final class ContentTitleNodeCreationHandlerFactory implements ContentRepositoryServiceFactoryInterface
{
    public function build(ContentRepositoryServiceFactoryDependencies $serviceFactoryDependencies): ContentRepositoryServiceInterface
    {
        return new ContentTitleNodeCreationHandler($serviceFactoryDependencies->contentRepository);
    }
}
