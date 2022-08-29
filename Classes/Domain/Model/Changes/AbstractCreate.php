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
use Neos\ContentRepository\Core\Projection\ContentGraph\Node;
use Neos\ContentRepository\Core\SharedModel\Node\NodeAggregateIdentifier;
use Neos\ContentRepository\Core\SharedModel\Node\NodeName;
use Neos\ContentRepository\Core\SharedModel\NodeType\NodeTypeName;
use Neos\ContentRepository\Core\Feature\NodeCreation\Command\CreateNodeAggregateWithNode;
use Neos\ContentRepository\Core\SharedModel\Exception\NodeNameIsAlreadyOccupied;
use Neos\ContentRepository\Core\DimensionSpace\OriginDimensionSpacePoint;
use Neos\ContentRepositoryRegistry\ContentRepositoryRegistry;
use Neos\Neos\Ui\Exception\InvalidNodeCreationHandlerException;
use Neos\Neos\Ui\NodeCreationHandler\NodeCreationHandlerInterface;

abstract class AbstractCreate extends AbstractStructuralChange
{
    /**
     * The type of the node that will be created
     */
    protected ?NodeTypeName $nodeTypeName;

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

    /**
     * @param Node $parentNode
     * @param NodeAggregateIdentifier|null $succeedingSiblingNodeAggregateIdentifier
     * @return Node
     * @throws InvalidNodeCreationHandlerException|NodeNameIsAlreadyOccupied|NodeException
     */
    protected function createNode(
        Node $parentNode,
        NodeAggregateIdentifier $succeedingSiblingNodeAggregateIdentifier = null
    ): Node {
        $nodeTypeName = $this->getNodeTypeName();
        if (is_null($nodeTypeName)) {
            throw new \RuntimeException('Cannot run createNode without a set node type.', 1645577794);
        }
        // TODO: the $name=... line should be as expressed below
        // $name = $this->getName() ?: $this->nodeService->generateUniqueNodeName($parent->findParentNode());
        $nodeName = NodeName::fromString($this->getName() ?: uniqid('node-', false));

        $nodeAggregateIdentifier = NodeAggregateIdentifier::create(); // generate a new NodeAggregateIdentifier

        $command = new CreateNodeAggregateWithNode(
            $parentNode->subgraphIdentity->contentStreamIdentifier,
            $nodeAggregateIdentifier,
            $nodeTypeName,
            OriginDimensionSpacePoint::fromDimensionSpacePoint($parentNode->subgraphIdentity->dimensionSpacePoint),
            $this->getInitiatingUserIdentifier(),
            $parentNode->nodeAggregateIdentifier,
            $succeedingSiblingNodeAggregateIdentifier,
            $nodeName
        );
        $contentRepository = $this->contentRepositoryRegistry->get($parentNode->subgraphIdentity->contentRepositoryIdentifier);

        $command = $this->applyNodeCreationHandlers($command, $nodeTypeName, $contentRepository);

        $contentRepository->handle($command)->block();
        /** @var Node $newlyCreatedNode */
        $newlyCreatedNode = $this->contentRepositoryRegistry->subgraphForNode($parentNode)
            ->findChildNodeConnectedThroughEdgeName($parentNode->nodeAggregateIdentifier, $nodeName);

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
        CreateNodeAggregateWithNode $command,
        NodeTypeName $nodeTypeName,
        ContentRepository $contentRepository
    ): CreateNodeAggregateWithNode {
        $data = $this->getData() ?: [];
        $nodeType = $contentRepository->getNodeTypeManager()->getNodeType($nodeTypeName->getValue());
        if (!isset($nodeType->getOptions()['nodeCreationHandlers'])
            || !is_array($nodeType->getOptions()['nodeCreationHandlers'])) {
            return $command;
        }
        foreach ($nodeType->getOptions()['nodeCreationHandlers'] as $nodeCreationHandlerConfiguration) {
            $nodeCreationHandler = new $nodeCreationHandlerConfiguration['nodeCreationHandler']();
            if (!$nodeCreationHandler instanceof NodeCreationHandlerInterface) {
                throw new InvalidNodeCreationHandlerException(sprintf(
                    'Expected %s but got "%s"',
                    NodeCreationHandlerInterface::class,
                    get_class($nodeCreationHandler)
                ), 1364759956);
            }
            $command = $nodeCreationHandler->handle($command, $data, $contentRepository);
        }
        return $command;
    }
}
