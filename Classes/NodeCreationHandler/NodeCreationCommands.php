<?php
declare(strict_types=1);

namespace Neos\Neos\Ui\NodeCreationHandler;

use Neos\ContentRepository\Core\CommandHandler\CommandInterface;
use Neos\ContentRepository\Core\Feature\NodeCreation\Command\CreateNodeAggregateWithNode;
use Neos\ContentRepository\Core\Feature\NodeDisabling\Command\DisableNodeAggregate;
use Neos\ContentRepository\Core\Feature\NodeDisabling\Command\EnableNodeAggregate;
use Neos\ContentRepository\Core\Feature\NodeModification\Command\SetNodeProperties;
use Neos\ContentRepository\Core\Feature\NodeModification\Dto\PropertyValuesToWrite;
use Neos\ContentRepository\Core\Feature\NodeReferencing\Command\SetNodeReferences;

class NodeCreationCommands implements \IteratorAggregate
{
    /** @var array<int|string, CommandInterface> */
    public readonly array $additionalCommands;

    /**
     * @internal to guarantee that the initial create command is mostly preserved as intended.
     * You should use {@see self::withInitialPropertyValues()} and {@see self::withAdditionalCommands()} instead.
     */
    public function __construct(
        /**
         * The original node creation command.
         * It is only allowed to mutate the properties via {@see self::withInitialPropertyValues()}
         */
        public readonly CreateNodeAggregateWithNode $initialCreateCommand,
        /**
         * Add a list of commands that are executed after the initial created command was run.
         * This allows you to create child-nodes and other operations.
         */
        CreateNodeAggregateWithNode|SetNodeProperties|DisableNodeAggregate|EnableNodeAggregate|SetNodeReferences ...$additionalCommands
    ) {
        $this->additionalCommands = $additionalCommands;
    }

    /**
     * Augment the initial {@see CreateNodeAggregateWithNode} command with altered properties.
     */
    public function withInitialPropertyValues(PropertyValuesToWrite $newInitialPropertyValues): self
    {
        return new self(
            $this->initialCreateCommand->withInitialPropertyValues($newInitialPropertyValues),
            ...$this->additionalCommands
        );
    }

    public function withAdditionalCommands(CommandInterface ...$additionalCommands): self
    {
        return new self($this->initialCreateCommand, ...$this->additionalCommands, ...$additionalCommands);
    }

    /**
     * @return \Traversable<int, CommandInterface>
     */
    public function getIterator(): \Traversable
    {
        yield $this->initialCreateCommand;
        yield from $this->additionalCommands;
    }
}
