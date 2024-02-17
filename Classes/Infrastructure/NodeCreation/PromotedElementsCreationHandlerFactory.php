<?php

declare(strict_types=1);

namespace Neos\Neos\Ui\Infrastructure\NodeCreation;

use Neos\ContentRepository\Core\Factory\ContentRepositoryServiceFactoryDependencies;
use Neos\ContentRepository\Core\Factory\ContentRepositoryServiceFactoryInterface;
use Neos\ContentRepository\Core\Feature\NodeReferencing\Command\SetNodeReferences;
use Neos\ContentRepository\Core\Feature\NodeReferencing\Dto\NodeReferencesToWrite;
use Neos\ContentRepository\Core\NodeType\NodeTypeManager;
use Neos\ContentRepository\Core\SharedModel\Node\ReferenceName;
use Neos\Neos\Ui\Domain\NodeCreation\NodeCreationCommands;
use Neos\Neos\Ui\Domain\NodeCreation\NodeCreationElements;
use Neos\Neos\Ui\Domain\NodeCreation\NodeCreationHandlerInterface;

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

                // handle properties
                $propertyValues = $commands->first->initialPropertyValues;
                foreach ($nodeType->getProperties() as $propertyName => $propertyConfiguration) {
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
                    $propertyValues = $propertyValues->withValue($propertyName, $elements->getPropertyLike($propertyName));
                }

                // handle references
                $setReferencesCommands = [];
                foreach ($nodeType->getProperties() as $referenceName => $referenceConfiguration) {
                    // todo this will be replaced by $nodeType->getReferences()
                    if ($nodeType->getPropertyType($referenceName) !== 'references' && $nodeType->getPropertyType($referenceName) !== 'reference') {
                        continue; // no a reference
                    }
                    if (
                        !isset($referenceConfiguration['ui']['showInCreationDialog'])
                        || $referenceConfiguration['ui']['showInCreationDialog'] !== true
                    ) {
                        // not a promoted reference
                        continue;
                    }
                    if (!$elements->hasReferenceLike($referenceName)) {
                        continue;
                    }

                    $setReferencesCommands[] = SetNodeReferences::create(
                        $commands->first->contentStreamId,
                        $commands->first->nodeAggregateId,
                        $commands->first->originDimensionSpacePoint,
                        ReferenceName::fromString($referenceName),
                        NodeReferencesToWrite::fromNodeAggregateIds($elements->getReferenceLike($referenceName))
                    );
                }

                return $commands
                    ->withInitialPropertyValues($propertyValues)
                    ->withAdditionalCommands(...$setReferencesCommands);
            }
        };
    }
}
