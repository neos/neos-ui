<?php

declare(strict_types=1);

namespace Neos\Neos\Ui\NodeCreationHandler\Factory;

use Behat\Transliterator\Transliterator;
use Neos\ContentRepository\Core\ContentRepository;
use Neos\ContentRepository\Core\Dimension\ContentDimensionId;
use Neos\ContentRepository\Core\DimensionSpace\DimensionSpacePoint;
use Neos\ContentRepository\Core\Factory\ContentRepositoryServiceFactoryDependencies;
use Neos\ContentRepository\Core\Factory\ContentRepositoryServiceFactoryInterface;
use Neos\Flow\Annotations as Flow;
use Neos\Flow\I18n\Exception\InvalidLocaleIdentifierException;
use Neos\Flow\I18n\Locale;
use Neos\Neos\Service\TransliterationService;
use Neos\Neos\Ui\NodeCreationHandler\NodeCreationCommands;
use Neos\Neos\Ui\NodeCreationHandler\NodeCreationHandlerInterface;

/**
 * Node creation handler that
 *
 * - sets the "title" property according to the incoming title from a creation dialog
 * - sets the "uriPathSegment" property according to the specified title or node name
 *
 * @internal you should not to interact with this factory directly. The node creation handle will already be configured under `nodeCreationHandlers`
 * @implements ContentRepositoryServiceFactoryInterface<NodeCreationHandlerInterface>
 */
final class DocumentTitleNodeCreationHandlerFactory implements ContentRepositoryServiceFactoryInterface
{
    /**
     * @Flow\Inject
     */
    protected TransliterationService $transliterationService;

    public function build(ContentRepositoryServiceFactoryDependencies $serviceFactoryDependencies): NodeCreationHandlerInterface
    {
        return new class($serviceFactoryDependencies->contentRepository, $this->transliterationService) implements NodeCreationHandlerInterface
        {
            public function __construct(
                private readonly ContentRepository $contentRepository,
                private readonly TransliterationService $transliterationService
            ) {
            }

            /**
             * @param array<string|int,mixed> $data
             */
            public function handle(NodeCreationCommands $commands, array $data): NodeCreationCommands
            {
                if (
                    !$this->contentRepository->getNodeTypeManager()->getNodeType($commands->first->nodeTypeName)
                        ->isOfType('Neos.Neos:Document')
                ) {
                    return $commands;
                }
                $propertyValues = $commands->first->initialPropertyValues;
                if (isset($data['title'])) {
                    $propertyValues = $propertyValues->withValue('title', $data['title']);
                }

                // if specified, the uriPathSegment equals the title
                $uriPathSegment = $data['title'];

                // otherwise, we fall back to the node name
                if ($uriPathSegment === null && $commands->first->nodeName !== null) {
                    $uriPathSegment = $commands->first->nodeName->value;
                }

                // if not empty, we transliterate the uriPathSegment according to the language of the new node
                if ($uriPathSegment !== null && $uriPathSegment !== '') {
                    $uriPathSegment = $this->transliterateText(
                        $commands->first->originDimensionSpacePoint->toDimensionSpacePoint(),
                        $uriPathSegment
                    );
                } else {
                    // alternatively we set it to a random string
                    $uriPathSegment = uniqid('', true);
                }
                $uriPathSegment = Transliterator::urlize($uriPathSegment);
                $propertyValues = $propertyValues->withValue('uriPathSegment', $uriPathSegment);

                return $commands->withInitialPropertyValues($propertyValues);
            }

            private function transliterateText(DimensionSpacePoint $dimensionSpacePoint, string $text): string
            {
                $languageDimensionValue = $dimensionSpacePoint->getCoordinate(new ContentDimensionId('language'));
                if ($languageDimensionValue !== null) {
                    try {
                        $language = (new Locale($languageDimensionValue))->getLanguage();
                    } catch (InvalidLocaleIdentifierException $e) {
                        // we don't need to do anything here; we'll just transliterate the text.
                    }
                }
                return $this->transliterationService->transliterate($text, $language ?? null);
            }
        };
    }
}
