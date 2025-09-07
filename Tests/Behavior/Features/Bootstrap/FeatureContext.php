<?php

use Behat\Behat\Context\Context;
use Neos\Behat\FlowBootstrapTrait;
use Neos\Behat\FlowEntitiesTrait;
use Neos\ContentRepository\Core\ContentRepository;
use Neos\ContentRepository\Core\Factory\ContentRepositoryServiceFactoryInterface;
use Neos\ContentRepository\Core\Factory\ContentRepositoryServiceInterface;
use Neos\ContentRepository\Core\SharedModel\ContentRepository\ContentRepositoryId;
use Neos\ContentRepository\TestSuite\Behavior\Features\Bootstrap\CRBehavioralTestsSubjectProvider;
use Neos\ContentRepository\TestSuite\Behavior\Features\Bootstrap\CRTestSuiteTrait;
use Neos\ContentRepository\TestSuite\Fakes\FakeContentDimensionSourceFactory;
use Neos\ContentRepository\TestSuite\Fakes\FakeNodeTypeManagerFactory;
use Neos\ContentRepositoryRegistry\ContentRepositoryRegistry;

// phpcs:ignore PSR1.Classes.ClassDeclaration.MissingNamespace
class FeatureContext implements Context
{
    use FlowBootstrapTrait;
    use FlowEntitiesTrait;
    use CRTestSuiteTrait;
    use CRBehavioralTestsSubjectProvider;
    use LinkEditorTrait;

    private ContentRepositoryRegistry $contentRepositoryRegistry;

    public function __construct()
    {
        self::bootstrapFlow();
        $this->contentRepositoryRegistry = $this->getObject(ContentRepositoryRegistry::class);
    }

    /**
     * @template T of ContentRepositoryServiceInterface
     * @param ContentRepositoryServiceFactoryInterface<T> $factory
     * @return T
     */
    protected function getContentRepositoryService(
        ContentRepositoryServiceFactoryInterface $factory
    ): ContentRepositoryServiceInterface {
        $this->currentContentRepository !== null or throw new \RuntimeException('Content repository is not initialised.');
        return $this->contentRepositoryRegistry->buildService(
            $this->currentContentRepository->id,
            $factory
        );
    }

    protected function createContentRepository(
        ContentRepositoryId $contentRepositoryId
    ): ContentRepository {
        $this->contentRepositoryRegistry->resetFactoryInstance($contentRepositoryId);
        $contentRepository = $this->contentRepositoryRegistry->get($contentRepositoryId);
        FakeContentDimensionSourceFactory::reset();
        FakeNodeTypeManagerFactory::reset();

        return $contentRepository;
    }
}
