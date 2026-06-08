<?php
namespace Neos\Test\CrInteraction\Service;

use Neos\ContentRepository\Core\CommandHandler\CommandInterface;
use Neos\ContentRepository\Core\ContentRepository;
use Neos\ContentRepository\Core\Factory\ContentRepositoryFactory;
use Neos\ContentRepository\Core\Feature\Common\RebasableToOtherWorkspaceInterface;
use Neos\ContentRepository\Core\Feature\DimensionSpaceAdjustment\Command\AddDimensionShineThrough;
use Neos\ContentRepository\Core\Feature\DimensionSpaceAdjustment\Command\MoveDimensionSpacePoint;
use Neos\ContentRepository\Core\Feature\NodeCreation\Command\CreateNodeAggregateWithNode;
use Neos\ContentRepository\Core\Feature\NodeDisabling\Command\DisableNodeAggregate;
use Neos\ContentRepository\Core\Feature\NodeDisabling\Command\EnableNodeAggregate;
use Neos\ContentRepository\Core\Feature\NodeModification\Command\SetNodeProperties;
use Neos\ContentRepository\Core\Feature\NodeModification\Dto\PropertyValuesToWrite;
use Neos\ContentRepository\Core\Feature\NodeMove\Command\MoveNodeAggregate;
use Neos\ContentRepository\Core\Feature\NodeReferencing\Command\SetNodeReferences;
use Neos\ContentRepository\Core\Feature\NodeRemoval\Command\RemoveNodeAggregate;
use Neos\ContentRepository\Core\Feature\NodeRenaming\Command\ChangeNodeAggregateName;
use Neos\ContentRepository\Core\Feature\NodeTypeChange\Command\ChangeNodeAggregateType;
use Neos\ContentRepository\Core\Feature\NodeVariation\Command\CreateNodeVariant;
use Neos\ContentRepository\Core\Feature\RootNodeCreation\Command\CreateRootNodeAggregateWithNode;
use Neos\ContentRepository\Core\Feature\RootNodeCreation\Command\UpdateRootNodeAggregateDimensions;
use Neos\ContentRepository\Core\Feature\SubtreeTagging\Command\TagSubtree;
use Neos\ContentRepository\Core\Feature\SubtreeTagging\Command\UntagSubtree;
use Neos\ContentRepository\Core\Feature\WorkspaceCreation\Command\CreateRootWorkspace;
use Neos\ContentRepository\Core\Feature\WorkspaceCreation\Command\CreateWorkspace;
use Neos\ContentRepository\Core\Feature\WorkspaceModification\Command\ChangeBaseWorkspace;
use Neos\ContentRepository\Core\Feature\WorkspaceModification\Command\DeleteWorkspace;
use Neos\ContentRepository\Core\Feature\WorkspacePublication\Command\DiscardIndividualNodesFromWorkspace;
use Neos\ContentRepository\Core\Feature\WorkspacePublication\Command\DiscardWorkspace;
use Neos\ContentRepository\Core\Feature\WorkspacePublication\Command\PublishIndividualNodesFromWorkspace;
use Neos\ContentRepository\Core\Feature\WorkspacePublication\Command\PublishWorkspace;
use Neos\ContentRepository\Core\Feature\WorkspaceRebase\Command\RebaseWorkspace;

/**
 * Simplified version of {@see Neos\ContentRepository\TestSuite\Behavior\Features\Bootstrap\GenericCommandExecutionAndEventPublication::handleCommand}
 */
final readonly class CommandHandler
{
    public function __construct(
        private ContentRepository $contentRepository
    ) {
    }

    /**
     * @param array<mixed> $commandArguments
     */
    public function handleCommand(string $shortCommandName, array $commandArguments): void
    {
        $commandClassName = self::resolveShortCommandName($shortCommandName);

        $commandArguments = $this->addDefaultCommandArgumentValues($commandClassName, $commandArguments);
        $command = $commandClassName::fromArray($commandArguments);
        $this->contentRepository->handle($command);
    }

    /**
     * @param class-string<CommandInterface> $commandClassName
     * @param array<mixed> $commandArguments
     * @return array<mixed>
     */
    private function addDefaultCommandArgumentValues(string $commandClassName, array $commandArguments): array
    {
        if (is_string($commandArguments['coveredDimensionSpacePoint'] ?? null)) {
            $commandArguments['coveredDimensionSpacePoint'] = \json_decode($commandArguments['coveredDimensionSpacePoint'], true, 512, JSON_THROW_ON_ERROR);
        }
        if ($commandClassName === CreateNodeAggregateWithNode::class) {
            if (is_string($commandArguments['initialPropertyValues'] ?? null)) {
                $commandArguments['initialPropertyValues'] = self::deserializeProperties(json_decode($commandArguments['initialPropertyValues'], true, 512, JSON_THROW_ON_ERROR))->values;
            }
            if (isset($commandArguments['succeedingSiblingNodeAggregateId']) && $commandArguments['succeedingSiblingNodeAggregateId'] === '') {
                unset($commandArguments['succeedingSiblingNodeAggregateId']);
            }
            if (empty($commandArguments['nodeName'])) {
                unset($commandArguments['nodeName']);
            }
        }
        if ($commandClassName === SetNodeProperties::class) {
            if (is_string($commandArguments['propertyValues'] ?? null)) {
                $commandArguments['propertyValues'] = self::deserializeProperties(json_decode($commandArguments['propertyValues'], true, 512, JSON_THROW_ON_ERROR))->values;
            }
        }
        if ($commandClassName === CreateNodeAggregateWithNode::class || $commandClassName === SetNodeProperties::class) {
            if (is_string($commandArguments['originDimensionSpacePoint'] ?? null) && !empty($commandArguments['originDimensionSpacePoint'])) {
                $commandArguments['originDimensionSpacePoint'] = OriginDimensionSpacePoint::fromJsonString($commandArguments['originDimensionSpacePoint'])->coordinates;
            }
        }
        if ($commandClassName === CreateNodeAggregateWithNode::class || $commandClassName === ChangeNodeAggregateType::class || $commandClassName === CreateRootNodeAggregateWithNode::class) {
            if (is_string($commandArguments['tetheredDescendantNodeAggregateIds'] ?? null)) {
                if ($commandArguments['tetheredDescendantNodeAggregateIds'] === '') {
                    unset($commandArguments['tetheredDescendantNodeAggregateIds']);
                } else {
                    $commandArguments['tetheredDescendantNodeAggregateIds'] = json_decode($commandArguments['tetheredDescendantNodeAggregateIds'], true, 512, JSON_THROW_ON_ERROR);
                }
            }
        }
        return $commandArguments;
    }

    /**
     * @param array<mixed> $properties
     */
    private static function deserializeProperties(array $properties): PropertyValuesToWrite
    {
        return PropertyValuesToWrite::fromArray(
            array_map(
                static fn (mixed $value) => is_array($value) && isset($value['__type']) ? new $value['__type']($value['value']) : $value,
                $properties
            )
        );
    }

    /**
     * @return class-string<CommandInterface>
     */
    protected static function resolveShortCommandName(string $shortCommandName): string
    {
        $commandClassNames = [
            AddDimensionShineThrough::class,
            ChangeBaseWorkspace::class,
            ChangeNodeAggregateName::class,
            ChangeNodeAggregateType::class,
            CreateNodeAggregateWithNode::class,
            CreateNodeVariant::class,
            CreateRootNodeAggregateWithNode::class,
            CreateRootWorkspace::class,
            CreateWorkspace::class,
            DeleteWorkspace::class,
            DisableNodeAggregate::class,
            DiscardIndividualNodesFromWorkspace::class,
            DiscardWorkspace::class,
            EnableNodeAggregate::class,
            MoveDimensionSpacePoint::class,
            MoveNodeAggregate::class,
            PublishIndividualNodesFromWorkspace::class,
            PublishWorkspace::class,
            RebasableToOtherWorkspaceInterface::class,
            RebaseWorkspace::class,
            RemoveNodeAggregate::class,
            SetNodeProperties::class,
            SetNodeReferences::class,
            TagSubtree::class,
            UntagSubtree::class,
            UpdateRootNodeAggregateDimensions::class,
        ];
        foreach ($commandClassNames as $commandClassName) {
            if (substr(strrchr($commandClassName, '\\'), 1) === $shortCommandName) {
                return $commandClassName;
            }
        }
        throw new \RuntimeException('The short command name "' . $shortCommandName . '" is currently not supported by the tests.');
    }
}