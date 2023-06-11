<?php
declare(strict_types=1);
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

use Neos\ContentRepository\Core\CommandHandler\CommandInterface;
use Neos\ContentRepository\Core\Feature\NodeCreation\Command\CreateNodeAggregateWithNode;
use Neos\ContentRepository\Core\Feature\NodeDisabling\Command\DisableNodeAggregate;
use Neos\ContentRepository\Core\Feature\NodeDisabling\Command\EnableNodeAggregate;
use Neos\ContentRepository\Core\Feature\NodeModification\Command\SetNodeProperties;
use Neos\ContentRepository\Core\Feature\NodeModification\Dto\PropertyValuesToWrite;
use Neos\ContentRepository\Core\Feature\NodeReferencing\Command\SetNodeReferences;

/**
 * A collection of commands that can be "enriched" via a {@see NodeCreationHandlerInterface}
 * The first command points to the initial node creation command.
 * It is ensured, that the initial node creation command, will be mostly preserved, to not contradict the users intend.
 *
 * Additional commands can be also appended, to be run after the initial node creation command.
 *
 * All commands will be executed blocking.
 *
 * @api except the constructor
 */
class NodeCreationCommands implements \IteratorAggregate
{
    /**
     * The initial node creation command.
     * It is only allowed to change its properties via {@see self::withInitialPropertyValues()}
     */
    public readonly CreateNodeAggregateWithNode $first;

    /**
     * Add a list of commands that are executed after the initial created command was run.
     * This allows to create child-nodes and append other allowed commands.
     *
     * @var array<int|string, CreateNodeAggregateWithNode|SetNodeProperties|DisableNodeAggregate|EnableNodeAggregate|SetNodeReferences>
     */
    public readonly array $additionalCommands;

    /**
     * @internal to guarantee that the initial create command is mostly preserved as intended.
     * You can use {@see self::withInitialPropertyValues()} to add new properties of the to be created node.
     */
    public function __construct(
        CreateNodeAggregateWithNode $first,
        CreateNodeAggregateWithNode|SetNodeProperties|DisableNodeAggregate|EnableNodeAggregate|SetNodeReferences ...$additionalCommands
    ) {
        $this->first = $first;
        $this->additionalCommands = $additionalCommands;
    }

    /**
     * Augment the first {@see CreateNodeAggregateWithNode} command with altered properties.
     */
    public function withInitialPropertyValues(PropertyValuesToWrite $newInitialPropertyValues): self
    {
        return new self(
            $this->first->withInitialPropertyValues($newInitialPropertyValues),
            ...$this->additionalCommands
        );
    }

    public function withAdditionalCommands(
        CreateNodeAggregateWithNode|SetNodeProperties|DisableNodeAggregate|EnableNodeAggregate|SetNodeReferences ...$additionalCommands
    ): self {
        return new self($this->first, ...$this->additionalCommands, ...$additionalCommands);
    }

    /**
     * @return \Traversable<int, CommandInterface>
     */
    public function getIterator(): \Traversable
    {
        yield $this->first;
        yield from $this->additionalCommands;
    }
}
