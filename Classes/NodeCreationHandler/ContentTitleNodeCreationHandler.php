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
use Neos\ContentRepository\Core\SharedModel\NodeType\NodeTypeManager;
use Neos\ContentRepository\Core\Feature\Common\Exception\NodeTypeNotFoundException;
use Neos\ContentRepository\Core\Feature\NodeCreation\Command\CreateNodeAggregateWithNode;
use Neos\Flow\Annotations as Flow;
use Neos\Neos\Service\TransliterationService;

/**
 * Node creation handler that sets the "title" property for new content elements according
 * to the incoming title from a creation dialog.
 *
 * Note: This is not actually a Command Handler in the sense of CQRS but rather some kind of
 *       "command enricher"
 */
class ContentTitleNodeCreationHandler implements NodeCreationHandlerInterface
{
    /**
     * @Flow\Inject
     * @var TransliterationService
     */
    protected $transliterationService;

    /**
     * Set the node title for the newly created Content node
     *
     * @param array<string|int,mixed> $data incoming data from the creationDialog
     * @throws NodeTypeNotFoundException
     */
    public function handle(CreateNodeAggregateWithNode $command, array $data, ContentRepository $contentRepository): CreateNodeAggregateWithNode
    {
        if (
            !$contentRepository->getNodeTypeManager()->getNodeType($command->nodeTypeName->getValue())
                ->isOfType('Neos.Neos:Content')
        ) {
            return $command;
        }

        $propertyValues = $command->initialPropertyValues;
        if (isset($data['title'])) {
            $propertyValues = $propertyValues->withValue('title', $data['title']);
        }

        return $command->withInitialPropertyValues($propertyValues);
    }
}
