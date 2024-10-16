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

use Neos\ContentRepository\Core\NodeType\NodeTypeName;
use Neos\ContentRepository\Core\Projection\ContentGraph\Filter\FindChildNodesFilter;
use Neos\ContentRepository\Core\Projection\ContentGraph\Node;
use Neos\ContentRepository\Core\Projection\ContentGraph\Nodes;
use Neos\ContentRepository\Core\SharedModel\Node\NodeAddress;
use Neos\ContentRepository\Core\SharedModel\Node\NodeAggregateClassification;
use Neos\Flow\Annotations as Flow;
use Neos\Neos\Ui\ContentRepository\Service\NeosUiNodeService;
use Neos\Neos\Ui\Domain\Model\AbstractChange;
use Neos\Neos\Ui\Domain\Model\Feedback\Operations\ReloadDocument;
use Neos\Neos\Ui\Domain\Model\Feedback\Operations\RenderContentOutOfBand;
use Neos\Neos\Ui\Domain\Model\Feedback\Operations\UpdateNodeInfo;
use Neos\Neos\Ui\Domain\Model\RenderedNodeDomAddress;

/**
 * A change that performs structural actions like moving or creating nodes
 * @internal These objects internally reflect possible operations made by the Neos.Ui.
 *           They are sorely an implementation detail. You should not use them!
 *           Please look into the php command API of the Neos CR instead.
 */
abstract class AbstractStructuralChange extends AbstractChange
{
    /**
     * The node dom address for the parent node of the created node
     */
    protected ?RenderedNodeDomAddress $parentDomAddress = null;

    /**
     * The node dom address for the referenced sibling node of the created node
     */
    protected ?RenderedNodeDomAddress $siblingDomAddress = null;

    /**
     * @Flow\Inject
     * @var NeosUiNodeService
     */
    protected $nodeService;

    protected ?Node $cachedSiblingNode = null;

    /**
     * Used when creating nodes within non-default tree preset
     */
    protected ?string $baseNodeType = null;

    public function setBaseNodeType(string $baseNodeType): void
    {
        $this->baseNodeType = $baseNodeType;
    }

    public function getBaseNodeType(): ?string
    {
        return $this->baseNodeType;
    }

    /**
     * Get the insertion mode (before|after|into) that is represented by this change
     */
    abstract public function getMode(): string;

    public function setParentDomAddress(RenderedNodeDomAddress $parentDomAddress = null): void
    {
        $this->parentDomAddress = $parentDomAddress;
    }

    /**
     * Get the DOM address of the closest RENDERED node in the DOM tree.
     *
     * DOES NOT HAVE TO BE THE PARENT NODE!
     */
    public function getParentDomAddress(): ?RenderedNodeDomAddress
    {
        return $this->parentDomAddress;
    }

    public function setSiblingDomAddress(RenderedNodeDomAddress $siblingDomAddress = null): void
    {
        $this->siblingDomAddress = $siblingDomAddress;
    }

    public function getSiblingDomAddress(): ?RenderedNodeDomAddress
    {
        return $this->siblingDomAddress;
    }

    /**
     * Get the sibling node
     */
    public function getSiblingNode(): ?Node
    {
        if ($this->siblingDomAddress === null) {
            return null;
        }

        if ($this->cachedSiblingNode === null) {
            $this->cachedSiblingNode = $this->nodeService->findNodeBySerializedNodeAddress(
                $this->siblingDomAddress->getContextPath()
            );
        }

        return $this->cachedSiblingNode;
    }

    /**
     * Perform finish tasks - needs to be called from inheriting class on `apply`
     *
     * @param Node $node
     * @return void
     */
    protected function finish(Node $node)
    {
        $updateNodeInfo = new UpdateNodeInfo();
        $updateNodeInfo->setNode($node);
        $updateNodeInfo->recursive();
        $this->feedbackCollection->add($updateNodeInfo);

        $parentNode = $this->contentRepositoryRegistry->subgraphForNode($node)
            ->findParentNode($node->aggregateId);
        if ($parentNode) {
            $updateParentNodeInfo = new UpdateNodeInfo();
            $updateParentNodeInfo->setNode($parentNode);
            if ($this->baseNodeType) {
                $updateParentNodeInfo->setBaseNodeType($this->baseNodeType);
            }
            $this->feedbackCollection->add($updateParentNodeInfo);
        }

        $this->updateWorkspaceInfo();

        if ($this->getNodeType($node)?->isOfType('Neos.Neos:Content')
            && ($this->getParentDomAddress() || $this->getSiblingDomAddress())) {
            // we can ONLY render out of band if:
            // 1) the parent of our new (or copied or moved) node is a ContentCollection;
            // so we can directly update an element of this content collection

            if ($parentNode && $this->getNodeType($parentNode)?->isOfType('Neos.Neos:ContentCollection') &&
                // 2) the parent DOM address (i.e. the closest RENDERED node in DOM is actually the ContentCollection;
                // and no other node in between
                $this->getParentDomAddress() &&
                $this->getParentDomAddress()->getFusionPath() &&
                $this->getParentDomAddress()->getContextPath() ===
                    NodeAddress::fromNode($parentNode)->toJson()
            ) {
                $renderContentOutOfBand = new RenderContentOutOfBand();
                $renderContentOutOfBand->setNode($node);
                $renderContentOutOfBand->setParentDomAddress($this->getParentDomAddress());
                $renderContentOutOfBand->setSiblingDomAddress($this->getSiblingDomAddress());
                $renderContentOutOfBand->setMode($this->getMode());

                $this->feedbackCollection->add($renderContentOutOfBand);
            } else {
                $reloadDocument = new ReloadDocument();
                $reloadDocument->setNode($node);

                $this->feedbackCollection->add($reloadDocument);
            }
        }
    }

    final protected function findChildNodes(Node $node): Nodes
    {
        // TODO REMOVE
        return $this->contentRepositoryRegistry->subgraphForNode($node)
            ->findChildNodes($node->aggregateId, FindChildNodesFilter::create());
    }

    final protected function isNodeTypeAllowedAsChildNode(Node $parentNode, NodeTypeName $nodeTypeNameToCheck): bool
    {
        $nodeTypeManager = $this->contentRepositoryRegistry->get($parentNode->contentRepositoryId)->getNodeTypeManager();

        $parentNodeType = $nodeTypeManager->getNodeType($parentNode->nodeTypeName);
        if (!$parentNodeType) {
            return false;
        }

        if ($parentNode->classification !== NodeAggregateClassification::CLASSIFICATION_TETHERED) {
            $nodeTypeToCheck = $nodeTypeManager->getNodeType($nodeTypeNameToCheck);
            if (!$nodeTypeToCheck) {
                return false;
            }
            return $parentNodeType->allowsChildNodeType($nodeTypeToCheck);
        }
        assert($parentNode->name !== null); // were tethered
        $subgraph = $this->contentRepositoryRegistry->subgraphForNode($parentNode);
        $grandParentNode = $subgraph->findParentNode($parentNode->aggregateId);

        return !$grandParentNode || $nodeTypeManager->isNodeTypeAllowedAsChildToTetheredNode(
            $grandParentNode->nodeTypeName,
            $parentNode->name,
            $nodeTypeNameToCheck
        );
    }
}
