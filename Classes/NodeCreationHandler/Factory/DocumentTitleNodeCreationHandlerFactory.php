<?php

declare(strict_types=1);

namespace Neos\Neos\Ui\NodeCreationHandler\Factory;

use Neos\ContentRepository\Core\Factory\ContentRepositoryServiceFactoryDependencies;
use Neos\ContentRepository\Core\Factory\ContentRepositoryServiceFactoryInterface;
use Neos\ContentRepository\Core\Factory\ContentRepositoryServiceInterface;
use Neos\Flow\Annotations as Flow;
use Neos\Neos\Service\TransliterationService;
use Neos\Neos\Ui\NodeCreationHandler\ContentTitleNodeCreationHandler;
use Neos\Neos\Ui\NodeCreationHandler\DocumentTitleNodeCreationHandler;

/**
 * @implements ContentRepositoryServiceFactoryInterface<DocumentTitleNodeCreationHandler>
 */
final class DocumentTitleNodeCreationHandlerFactory implements ContentRepositoryServiceFactoryInterface
{
    /**
     * @Flow\Inject
     */
    protected TransliterationService $transliterationService;

    public function build(ContentRepositoryServiceFactoryDependencies $serviceFactoryDependencies): ContentRepositoryServiceInterface
    {
        return new DocumentTitleNodeCreationHandler($serviceFactoryDependencies->contentRepository, $this->transliterationService);
    }
}
