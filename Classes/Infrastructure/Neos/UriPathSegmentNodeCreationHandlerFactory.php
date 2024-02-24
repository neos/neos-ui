<?php

declare(strict_types=1);

namespace Neos\Neos\Ui\Infrastructure\Neos;

use Behat\Transliterator\Transliterator;
use Neos\ContentRepository\Core\Dimension\ContentDimensionId;
use Neos\ContentRepository\Core\DimensionSpace\DimensionSpacePoint;
use Neos\ContentRepository\Core\Factory\ContentRepositoryServiceFactoryDependencies;
use Neos\ContentRepository\Core\Factory\ContentRepositoryServiceFactoryInterface;
use Neos\ContentRepository\Core\NodeType\NodeTypeManager;
use Neos\Flow\Annotations as Flow;
use Neos\Flow\I18n\Exception\InvalidLocaleIdentifierException;
use Neos\Flow\I18n\Locale;
use Neos\Neos\Service\TransliterationService;
use Neos\Neos\Ui\Domain\NodeCreation\NodeCreationCommands;
use Neos\Neos\Ui\Domain\NodeCreation\NodeCreationElements;
use Neos\Neos\Ui\Domain\NodeCreation\NodeCreationHandlerInterface;

/**
 * Node creation handler that
 *
 * - sets the "uriPathSegment" property according to the specified title or node name
 * - sets the "title" property according to the incoming title from a creation dialog
 *   - (actually obsolete with PromotedElementsCreationHandler)
 *
 * @internal you should not to interact with this factory directly. The node creation handle will already be configured under `nodeCreationHandlers`
 * @implements ContentRepositoryServiceFactoryInterface<NodeCreationHandlerInterface>
 */
final class UriPathSegmentNodeCreationHandlerFactory implements ContentRepositoryServiceFactoryInterface
{
    /**
     * @Flow\Inject
     */
    protected TransliterationService $transliterationService;

    public function build(ContentRepositoryServiceFactoryDependencies $serviceFactoryDependencies): NodeCreationHandlerInterface
    {
        return new class($serviceFactoryDependencies->nodeTypeManager, $this->transliterationService) implements NodeCreationHandlerInterface {
            public function __construct(
                private readonly NodeTypeManager $nodeTypeManager,
                private readonly TransliterationService $transliterationService
            ) {
            }

            public function handle(NodeCreationCommands $commands, NodeCreationElements $elements): NodeCreationCommands
            {
                if (
                    !$this->nodeTypeManager->getNodeType($commands->first->nodeTypeName)
                        ->isOfType('Neos.Neos:Document')
                ) {
                    return $commands;
                }
                $propertyValues = $commands->first->initialPropertyValues;

                if ($elements->hasPropertyLike('title')) {
                    // technically we only need to set the uriPathSegment as the PromotedElementsCreationHandler
                    // will take care of setting the title already
                    $propertyValues = $propertyValues->withValue('title', $elements->getPropertyLike('title'));
                }

                // if specified, the uriPathSegment equals the title
                $uriPathSegment = $elements->getPropertyLike('title');

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
                    // todo in case the title is missing dont set it to something random like 65d0ba5d8f4593-93420885
                    // but use the node label name instead like in 8.3. The problem is with two nodes on the same level.
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
