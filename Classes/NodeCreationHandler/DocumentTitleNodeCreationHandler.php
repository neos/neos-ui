<?php
namespace Neos\Neos\Ui\NodeCreationHandler;

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
use Neos\Flow\Annotations as Flow;
use Behat\Transliterator\Transliterator;
use Neos\ContentRepository\Core\Dimension\ContentDimensionId;
use Neos\ContentRepository\Core\DimensionSpace\DimensionSpacePoint;
use Neos\ContentRepository\Core\Feature\NodeCreation\Command\CreateNodeAggregateWithNode;
use Neos\ContentRepository\Core\NodeType\NodeTypeManager;
use Neos\Flow\I18n\Exception\InvalidLocaleIdentifierException;
use Neos\Flow\I18n\Locale;
use Neos\Neos\Service\TransliterationService;

/**
 * Node creation handler that
 *
 * - sets the "title" property according to the incoming title from a creation dialog
 * - sets the "uriPathSegment" property according to the specified title or node name
 *
 * Note: This is not actually a Command Handler in the sense of CQRS but rather some kind of
 *       "command enricher"
 */
class DocumentTitleNodeCreationHandler implements NodeCreationHandlerInterface
{
    /**
     * @Flow\Inject
     * @var TransliterationService
     */
    protected $transliterationService;

    /**
     * @param array<string|int,mixed> $data
     */
    public function handle(CreateNodeAggregateWithNode $command, array $data, ContentRepository $contentRepository): CreateNodeAggregateWithNode
    {
        if (
            !$contentRepository->getNodeTypeManager()->getNodeType($command->nodeTypeName)
                ->isOfType('Neos.Neos:Document')
        ) {
            return $command;
        }
        $propertyValues = $command->initialPropertyValues;
        if (isset($data['title'])) {
            $propertyValues = $propertyValues->withValue('title', $data['title']);
        }

        // if specified, the uriPathSegment equals the title
        $uriPathSegment = $data['title'];

        // otherwise, we fall back to the node name
        if ($uriPathSegment === null && $command->nodeName !== null) {
            $uriPathSegment = $command->nodeName->value;
        }

        // if not empty, we transliterate the uriPathSegment according to the language of the new node
        if ($uriPathSegment !== null && $uriPathSegment !== '') {
            $uriPathSegment = $this->transliterateText(
                $command->originDimensionSpacePoint->toDimensionSpacePoint(),
                $uriPathSegment
            );
        } else {
            // alternatively we set it to a random string
            $uriPathSegment = uniqid('', true);
        }
        $uriPathSegment = Transliterator::urlize($uriPathSegment);
        $propertyValues = $propertyValues->withValue('uriPathSegment', $uriPathSegment);

        return $command->withInitialPropertyValues($propertyValues);
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
}
