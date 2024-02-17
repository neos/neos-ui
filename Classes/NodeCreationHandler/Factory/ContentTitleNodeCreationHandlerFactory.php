<?php

declare(strict_types=1);

namespace Neos\Neos\Ui\NodeCreationHandler\Factory;

use Neos\ContentRepository\Core\ContentRepository;
use Neos\ContentRepository\Core\Factory\ContentRepositoryServiceFactoryDependencies;
use Neos\ContentRepository\Core\Factory\ContentRepositoryServiceFactoryInterface;
use Neos\ContentRepository\Core\SharedModel\Exception\NodeTypeNotFoundException;
use Neos\Neos\Ui\NodeCreationHandler\NodeCreationCommands;
use Neos\Neos\Ui\NodeCreationHandler\NodeCreationHandlerInterface;

/**
 * Node creation handler that sets the "title" property for new content elements according
 * to the incoming title from a creation dialog.
 *
 * @internal you should not to interact with this factory directly. The node creation handle will already be configured under `nodeCreationHandlers`
 * @implements ContentRepositoryServiceFactoryInterface<NodeCreationHandlerInterface>
 */
final class ContentTitleNodeCreationHandlerFactory implements ContentRepositoryServiceFactoryInterface
{
    public function build(ContentRepositoryServiceFactoryDependencies $serviceFactoryDependencies): NodeCreationHandlerInterface
    {
        return new class($serviceFactoryDependencies->contentRepository) implements NodeCreationHandlerInterface
        {
            public function __construct(
                private readonly ContentRepository $contentRepository
            ) {
            }

            /**
             * Set the node title for the newly created Content node
             *
             * @param array<string|int,mixed> $data incoming data from the creationDialog
             * @throws NodeTypeNotFoundException
             */
            public function handle(NodeCreationCommands $commands, array $data): NodeCreationCommands
            {
                if (
                    !$this->contentRepository->getNodeTypeManager()->getNodeType($commands->first->nodeTypeName)
                        ->isOfType('Neos.Neos:Content')
                ) {
                    return $commands;
                }

                $propertyValues = $commands->first->initialPropertyValues;
                if (isset($data['title'])) {
                    $propertyValues = $propertyValues->withValue('title', $data['title']);
                }

                return $commands->withInitialPropertyValues($propertyValues);
            }
        };
    }
}
