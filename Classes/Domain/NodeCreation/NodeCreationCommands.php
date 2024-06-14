<?php
declare(strict_types=1);
namespace Neos\Neos\Ui\Domain\NodeCreation;

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
use Neos\ContentRepository\Core\Feature\NodeCreation\Dto\NodeAggregateIdsByNodePaths;
use Neos\ContentRepository\Core\Feature\NodeDisabling\Command\DisableNodeAggregate;
use Neos\ContentRepository\Core\Feature\NodeDisabling\Command\EnableNodeAggregate;
use Neos\ContentRepository\Core\Feature\NodeDuplication\Command\CopyNodesRecursively;
use Neos\ContentRepository\Core\Feature\NodeModification\Command\SetNodeProperties;
use Neos\ContentRepository\Core\Feature\NodeModification\Dto\PropertyValuesToWrite;
use Neos\ContentRepository\Core\Feature\NodeReferencing\Command\SetNodeReferences;
use Neos\ContentRepository\Core\NodeType\NodeTypeManager;

/**
 * A collection of commands that describe a node creation from the Neos Ui.
 *
 * The node creation can be enriched via a node creation handler {@see NodeCreationHandlerInterface}
 *
 * The first command points to the triggered node creation command.
 * To not contradict the users intend it is ensured that the initial node
 * creation will be mostly preserved by only allowing to add additional properties.
 *
 * Additional commands can be also appended, to be run after the initial node creation command.
 *
 * You can retrieve the subgraph or the parent node (where the first node will be created in) the following way:
 *
 *     $subgraph = $contentRepository->getContentGraph()->getSubgraph(
 *         $commands->first->contentStreamId,
 *         $commands->first->originDimensionSpacePoint->toDimensionSpacePoint(),
 *         VisibilityConstraints::frontend()
 *     );
 *     $parentNode = $subgraph->findNodeById($commands->first->parentNodeAggregateId);
 *
 * @implements \IteratorAggregate<int, CommandInterface>
 * @internal Especially the constructors
 */
final readonly class NodeCreationCommands implements \IteratorAggregate
{
    /**
     * The initial node creation command.
     * It is only allowed to change its properties via {@see self::withInitialPropertyValues()}
     */
    public CreateNodeAggregateWithNode $first;

    /**
     * Add a list of commands that are executed after the initial created command was run.
     * This allows to create child-nodes and append other allowed commands.
     *
     * @var array<int,CreateNodeAggregateWithNode|SetNodeProperties|DisableNodeAggregate|EnableNodeAggregate|SetNodeReferences|CopyNodesRecursively>
     */
    public array $additionalCommands;

    private function __construct(
        CreateNodeAggregateWithNode $first,
        CreateNodeAggregateWithNode|SetNodeProperties|DisableNodeAggregate|EnableNodeAggregate|SetNodeReferences|CopyNodesRecursively ...$additionalCommands
    ) {
        $this->first = $first;
        $this->additionalCommands = array_values($additionalCommands);
    }

    /**
     * @internal to guarantee that the initial create command is mostly preserved as intended.
     * You can use {@see self::withInitialPropertyValues()} to add new properties of the to be created node.
     */
    public static function fromFirstCommand(
        CreateNodeAggregateWithNode $first,
        NodeTypeManager $nodeTypeManager
    ): self {
        $tetheredDescendantNodeAggregateIds = NodeAggregateIdsByNodePaths::createForNodeType(
            $first->nodeTypeName,
            $nodeTypeManager
        );
        return new self(
            $first->withTetheredDescendantNodeAggregateIds($tetheredDescendantNodeAggregateIds),
        );
    }

    /**
     * Augment the first {@see CreateNodeAggregateWithNode} command with altered properties.
     *
     * The properties will be completely replaced.
     * To merge the properties please use:
     *
     *     $commands->withInitialPropertyValues(
     *         $commands->first->initialPropertyValues
     *             ->withValue('album', 'rep')
     *     )
     *
     */
    public function withInitialPropertyValues(PropertyValuesToWrite $newInitialPropertyValues): self
    {
        return new self(
            $this->first->withInitialPropertyValues($newInitialPropertyValues),
            ...$this->additionalCommands
        );
    }

    public function withAdditionalCommands(
        CreateNodeAggregateWithNode|SetNodeProperties|DisableNodeAggregate|EnableNodeAggregate|SetNodeReferences|CopyNodesRecursively ...$additionalCommands
    ): self {
        return new self($this->first, ...$this->additionalCommands, ...$additionalCommands);
    }

    /**
     * @return \Traversable<int, CommandInterface>
     */
    public function getIterator(): \Traversable
    {
        yield from [$this->first, ...$this->additionalCommands];
    }
}
