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
use Neos\Neos\Utility\NodeUriPathSegmentGenerator;

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
     * @var NodeUriPathSegmentGenerator
     */
    protected $nodeUriPathSegmentGenerator;

    /**
     * @param array<string|int,mixed> $data
     */
    public function handle(NodeCreationCommands $commands, array $data, ContentRepository $contentRepository): NodeCreationCommands
    {
        $initialCommand = $commands->initialCreateCommand;
        if (
            !$contentRepository->getNodeTypeManager()->getNodeType($initialCommand->nodeTypeName)
                ->isOfType('Neos.Neos:Document')
        ) {
            return $commands;
        }
        $propertyValues = $initialCommand->initialPropertyValues;
        if (isset($data['title'])) {
            $propertyValues = $propertyValues->withValue('title', $data['title']);
        }

        $uriPathSegment = match(true) {
            // if specified, the uriPathSegment equals the title
            !empty($data['title']) => $data['title'],
            // otherwise, we fall back to the node name
            $initialCommand->nodeName !== null => $initialCommand->nodeName,
            // last resort: set it to a random string
            default => uniqid('', true),
        };

        $propertyValues = $propertyValues->withValue(
            'uriPathSegment',
            $this->nodeUriPathSegmentGenerator->generateUriPathSegmentFromTextForDimension(
                $uriPathSegment,
                // we transliterate the uriPathSegment according to the language of the new node
                $initialCommand->originDimensionSpacePoint->toDimensionSpacePoint()
            )
        );

        return $commands->withInitialPropertyValues($propertyValues);
    }
}
