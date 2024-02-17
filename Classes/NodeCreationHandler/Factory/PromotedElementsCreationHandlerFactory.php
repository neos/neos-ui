<?php

declare(strict_types=1);

namespace Neos\Neos\Ui\NodeCreationHandler\Factory;

use Neos\ContentRepository\Core\Factory\ContentRepositoryServiceFactoryDependencies;
use Neos\ContentRepository\Core\Factory\ContentRepositoryServiceFactoryInterface;
use Neos\ContentRepository\Core\NodeType\NodeTypeManager;
use Neos\Neos\Ui\NodeCreationHandler\NodeCreationCommands;
use Neos\Neos\Ui\NodeCreationHandler\NodeCreationElements;
use Neos\Neos\Ui\NodeCreationHandler\NodeCreationHandlerInterface;

/**
 * Generic creation dialog node creation handler that iterates
 * properties that are configured to appear in the Creation Dialog (via "ui.showInCreationDialog" setting)
 * and sets the initial property values accordingly
 *
 * @internal you should not to interact with this factory directly. The node creation handle will already be configured under `nodeCreationHandlers`
 * @implements ContentRepositoryServiceFactoryInterface<NodeCreationHandlerInterface>
 */
final class PromotedElementsCreationHandlerFactory implements ContentRepositoryServiceFactoryInterface
{
    public function build(ContentRepositoryServiceFactoryDependencies $serviceFactoryDependencies): NodeCreationHandlerInterface
    {
        return new class($serviceFactoryDependencies->nodeTypeManager) implements NodeCreationHandlerInterface {
            public function __construct(
                private readonly NodeTypeManager $nodeTypeManager
            ) {
            }
            public function handle(NodeCreationCommands $commands, NodeCreationElements $elements): NodeCreationCommands
            {
                $nodeType = $this->nodeTypeManager->getNodeType($commands->first->nodeTypeName);
                $propertyValues = $commands->first->initialPropertyValues;
                foreach ($nodeType->getConfiguration('properties') as $propertyName => $propertyConfiguration) {
                    if (
                        !isset($propertyConfiguration['ui']['showInCreationDialog'])
                        || $propertyConfiguration['ui']['showInCreationDialog'] !== true
                    ) {
                        // not a promoted property
                        continue;
                    }
                    if (!$elements->hasPropertyLike($propertyName)) {
                        continue;
                    }
                    // todo support also references https://github.com/neos/neos-ui/issues/3615
                    $propertyValues = $propertyValues->withValue($propertyName, $elements->getPropertyLike($propertyName));
                }

                return $commands->withInitialPropertyValues($propertyValues);
            }
        };
    }
}
