<?php
declare(strict_types=1);
namespace Neos\Neos\Ui\Domain\Model\Changes;

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
use Neos\ContentRepository\Core\DimensionSpace\OriginDimensionSpacePoint;
use Neos\ContentRepository\Core\Factory\ContentRepositoryServiceFactoryInterface;
use Neos\ContentRepository\Core\Feature\NodeCreation\Command\CreateNodeAggregateWithNode;
use Neos\ContentRepository\Core\NodeType\NodeTypeName;
use Neos\ContentRepository\Core\Projection\ContentGraph\Node;
use Neos\ContentRepository\Core\SharedModel\Exception\NodeNameIsAlreadyOccupied;
use Neos\ContentRepository\Core\SharedModel\Node\NodeAggregateId;
use Neos\ContentRepository\Core\SharedModel\Node\NodeName;
use Neos\Flow\Annotations as Flow;
use Neos\Flow\ObjectManagement\ObjectManagerInterface;
use Neos\Neos\Ui\Domain\NodeCreation\NodeCreationHandlerFactoryInterface;
use Neos\Neos\Ui\Domain\Service\NodePropertyConversionService;
use Neos\Neos\Ui\Exception\InvalidNodeCreationHandlerException;
use Neos\Neos\Ui\Domain\NodeCreation\NodeCreationCommands;
use Neos\Neos\Ui\Domain\NodeCreation\NodeCreationElements;
use Neos\Neos\Ui\Domain\NodeCreation\NodeCreationHandlerInterface;
use Neos\Utility\PositionalArraySorter;

/**
 * @internal These objects internally reflect possible operations made by the Neos.Ui.
 *           They are sorely an implementation detail. You should not use them!
 *           Please look into the php command API of the Neos CR instead.
 */
abstract class AbstractCreate extends AbstractStructuralChange
{
    /**
     * @Flow\Inject
     */
    protected ObjectManagerInterface $objectManager;

    /**
     * @Flow\Inject
     */
    protected NodePropertyConversionService $nodePropertyConversionService;

    /**
     * The type of the node that will be created
     */
    protected ?NodeTypeName $nodeTypeName = null;

    /**
     * Incoming data from creationDialog
     *
     * @var array<int|string,mixed>
     */
    protected array $data = [];

    /**
     * An (optional) name that will be used for the new node path
     */
    protected ?string $name = null;

    /**
     * An (optional) node aggregate identifier that will be used for testing
     */
    protected ?NodeAggregateId $nodeAggregateId = null;

    /**
     * @param string $nodeTypeName
     */
    public function setNodeType(string $nodeTypeName): void
    {
        $this->nodeTypeName = NodeTypeName::fromString($nodeTypeName);
    }

    public function getNodeTypeName(): ?NodeTypeName
    {
        return $this->nodeTypeName;
    }

    /**
     * @phpstan-param array<int|string,mixed> $data
     * @param array $data
     */
    public function setData(array $data): void
    {
        $this->data = $data;
    }

    /**
     * @return array<int|string,mixed>
     */
    public function getData(): array
    {
        return $this->data;
    }

    public function setName(string $name): void
    {
        $this->name = $name;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setNodeAggregateId(string $nodeAggregateId): void
    {
        $this->nodeAggregateId = NodeAggregateId::fromString($nodeAggregateId);
    }

    public function getNodeAggregateId(): ?NodeAggregateId
    {
        return $this->nodeAggregateId;
    }

    /**
     * @param Node $parentNode
     * @param NodeAggregateId|null $succeedingSiblingNodeAggregateId
     * @return Node
     * @throws InvalidNodeCreationHandlerException
     */
    protected function createNode(
        Node $parentNode,
        NodeAggregateId $succeedingSiblingNodeAggregateId = null
    ): Node {
        $nodeTypeName = $this->getNodeTypeName();
        if (is_null($nodeTypeName)) {
            throw new \RuntimeException('Cannot run createNode without a set node type.', 1645577794);
        }
        $nodeName = $this->getName()
            ? NodeName::fromString($this->getName())
            : null;

        $nodeAggregateId = $this->getNodeAggregateId() ?? NodeAggregateId::create(); // generate a new NodeAggregateId

        $contentRepository = $this->contentRepositoryRegistry->get($parentNode->contentRepositoryId);

        $command = CreateNodeAggregateWithNode::create(
            $parentNode->workspaceName,
            $nodeAggregateId,
            $nodeTypeName,
            OriginDimensionSpacePoint::fromDimensionSpacePoint($parentNode->dimensionSpacePoint),
            $parentNode->aggregateId,
            $succeedingSiblingNodeAggregateId,
            $nodeName
        );

        $commands = $this->applyNodeCreationHandlers(
            NodeCreationCommands::fromFirstCommand(
                $command,
                $contentRepository->getNodeTypeManager()
            ),
            $this->nodePropertyConversionService->convertNodeCreationElements(
                $contentRepository->getNodeTypeManager()->getNodeType($nodeTypeName),
                $this->getData() ?: []
            ),
            $nodeTypeName,
            $contentRepository
        );

        foreach ($commands as $command) {
            $contentRepository->handle($command);
        }

        /** @var Node $newlyCreatedNode */
        $newlyCreatedNode = $this->contentRepositoryRegistry->subgraphForNode($parentNode)
            ->findNodeById($nodeAggregateId);

        $this->finish($newlyCreatedNode);
        // NOTE: we need to run "finish" before "addNodeCreatedFeedback"
        // to ensure the new node already exists when the last feedback is processed
        $this->addNodeCreatedFeedback($newlyCreatedNode);
        return $newlyCreatedNode;
    }

    /**
     * @throws InvalidNodeCreationHandlerException
     */
    protected function applyNodeCreationHandlers(
        NodeCreationCommands $commands,
        NodeCreationElements $elements,
        NodeTypeName $nodeTypeName,
        ContentRepository $contentRepository
    ): NodeCreationCommands {
        $nodeType = $contentRepository->getNodeTypeManager()->getNodeType($nodeTypeName);
        if (!isset($nodeType->getOptions()['nodeCreationHandlers'])
            || !is_array($nodeType->getOptions()['nodeCreationHandlers'])) {
            return $commands;
        }
        foreach ((new PositionalArraySorter($nodeType->getOptions()['nodeCreationHandlers']))->toArray() as $key => $nodeCreationHandlerConfiguration) {
            if (!isset($nodeCreationHandlerConfiguration['factoryClassName'])) {
                throw new InvalidNodeCreationHandlerException(sprintf(
                    'Node creation handler "%s" has no "factoryClassName" specified.',
                    $key
                ), 1697750190);
            }

            $nodeCreationHandlerFactory = $this->objectManager->get($nodeCreationHandlerConfiguration['factoryClassName']);
            if (!$nodeCreationHandlerFactory instanceof NodeCreationHandlerFactoryInterface) {
                throw new InvalidNodeCreationHandlerException(sprintf(
                    'Node creation handler "%s" didnt specify factory class of type %s. Got "%s"',
                    $key,
                    NodeCreationHandlerFactoryInterface::class,
                    get_class($nodeCreationHandlerFactory)
                ), 1697750193);
            }

            $nodeCreationHandler = $nodeCreationHandlerFactory->build($contentRepository);
            if (!$nodeCreationHandler instanceof NodeCreationHandlerInterface) {
                throw new InvalidNodeCreationHandlerException(sprintf(
                    'Node creation handler "%s" didnt specify factory class of type %s. Got "%s"',
                    $key,
                    NodeCreationHandlerInterface::class,
                    get_class($nodeCreationHandler)
                ), 1364759956);
            }
            $commands = $nodeCreationHandler->handle($commands, $elements);
        }
        return $commands;
    }
}
