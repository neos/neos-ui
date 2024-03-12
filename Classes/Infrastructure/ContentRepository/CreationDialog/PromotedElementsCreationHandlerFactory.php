<?php

declare(strict_types=1);

namespace Neos\Neos\Ui\Infrastructure\ContentRepository\CreationDialog;

use Neos\ContentRepository\Core\ContentRepository;
use Neos\ContentRepository\Core\Feature\NodeReferencing\Command\SetNodeReferences;
use Neos\ContentRepository\Core\Feature\NodeReferencing\Dto\NodeReferencesToWrite;
use Neos\ContentRepository\Core\NodeType\NodeTypeManager;
use Neos\ContentRepository\Core\SharedModel\Node\NodeAggregateIds;
use Neos\ContentRepository\Core\SharedModel\Node\ReferenceName;
use Neos\Neos\Ui\Domain\NodeCreation\NodeCreationCommands;
use Neos\Neos\Ui\Domain\NodeCreation\NodeCreationElements;
use Neos\Neos\Ui\Domain\NodeCreation\NodeCreationHandlerFactoryInterface;
use Neos\Neos\Ui\Domain\NodeCreation\NodeCreationHandlerInterface;

/**
 * Generic creation dialog node creation handler that iterates
 * properties that are configured to appear in the Creation Dialog (via "ui.showInCreationDialog" setting)
 * and sets the initial property values accordingly
 *
 * @internal you should not to interact with this factory directly. The node creation handle will already be configured under `nodeCreationHandlers`
 */
final class PromotedElementsCreationHandlerFactory implements NodeCreationHandlerFactoryInterface
{
    public function build(ContentRepository $contentRepository): NodeCreationHandlerInterface
    {
        return new class($contentRepository->getNodeTypeManager()) implements NodeCreationHandlerInterface {
            public function __construct(
                private readonly NodeTypeManager $nodeTypeManager
            ) {
            }

            public function handle(NodeCreationCommands $commands, NodeCreationElements $elements): NodeCreationCommands
            {
                $nodeType = $this->nodeTypeManager->getNodeType($commands->first->nodeTypeName);

                $propertyValues = $commands->first->initialPropertyValues;
                $setReferencesCommands = [];
                foreach ($elements as $elementName => $elementValue) {
                    // handle properties
                    // todo this will be simplified once hasProperty does not return true for references
                    if ($nodeType->hasProperty($elementName) && ($nodeType->getPropertyType($elementName) !== 'references' && $nodeType->getPropertyType($elementName) !== 'reference')) {
                        $propertyConfiguration = $nodeType->getProperties()[$elementName];
                        if (
                            ($propertyConfiguration['ui']['showInCreationDialog'] ?? false) === true
                        ) {
                            // a promoted element
                            $propertyValues = $propertyValues->withValue($elementName, $elementValue);
                        }
                    }

                    // handle references
                    // todo this will be replaced by $nodeType->hasReference()
                    if ($nodeType->hasProperty($elementName) && ($nodeType->getPropertyType($elementName) === 'references' || $nodeType->getPropertyType($elementName) === 'reference')) {
                        assert($elementValue instanceof NodeAggregateIds);
                        $referenceConfiguration = $nodeType->getProperties()[$elementName];
                        if (
                            ($referenceConfiguration['ui']['showInCreationDialog'] ?? false) === true
                        ) {
                            // a promoted element
                            $setReferencesCommands[] = SetNodeReferences::create(
                                $commands->first->contentStreamId,
                                $commands->first->nodeAggregateId,
                                $commands->first->originDimensionSpacePoint,
                                ReferenceName::fromString($elementName),
                                NodeReferencesToWrite::fromNodeAggregateIds($elementValue)
                            );
                        }
                    }
                }

                return $commands
                    ->withInitialPropertyValues($propertyValues)
                    ->withAdditionalCommands(...$setReferencesCommands);
            }
        };
    }
}
