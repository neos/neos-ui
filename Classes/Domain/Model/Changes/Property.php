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

use Neos\ContentRepository\Core\CommandHandler\CommandResult;
use Neos\ContentRepository\Core\DimensionSpace\Exception\DimensionSpacePointNotFound;
use Neos\ContentRepository\Core\DimensionSpace\OriginDimensionSpacePoint;
use Neos\ContentRepository\Core\Feature\NodeDisabling\Command\DisableNodeAggregate;
use Neos\ContentRepository\Core\Feature\NodeDisabling\Command\EnableNodeAggregate;
use Neos\ContentRepository\Core\Feature\NodeModification\Command\SetNodeProperties;
use Neos\ContentRepository\Core\Feature\NodeModification\Dto\PropertyValuesToWrite;
use Neos\ContentRepository\Core\Feature\NodeReferencing\Command\SetNodeReferences;
use Neos\ContentRepository\Core\Feature\NodeReferencing\Dto\NodeReferencesToWrite;
use Neos\ContentRepository\Core\Feature\NodeTypeChange\Command\ChangeNodeAggregateType;
use Neos\ContentRepository\Core\Feature\NodeTypeChange\Dto\NodeAggregateTypeChangeChildConstraintConflictResolutionStrategy;
use Neos\ContentRepository\Core\Feature\NodeVariation\Command\CreateNodeVariant;
use Neos\ContentRepository\Core\NodeType\NodeTypeName;
use Neos\ContentRepository\Core\Projection\ContentGraph\Node;
use Neos\ContentRepository\Core\Projection\Workspace\Workspace;
use Neos\ContentRepository\Core\SharedModel\Exception\ContentStreamDoesNotExistYet;
use Neos\ContentRepository\Core\SharedModel\Exception\NodeAggregatesTypeIsAmbiguous;
use Neos\ContentRepository\Core\SharedModel\Node\NodeAggregateIds;
use Neos\ContentRepository\Core\SharedModel\Node\NodeVariantSelectionStrategy;
use Neos\ContentRepository\Core\SharedModel\Node\ReferenceName;
use Neos\ContentRepositoryRegistry\ContentRepositoryRegistry;
use Neos\Flow\Annotations as Flow;
use Neos\Neos\Ui\Domain\Model\AbstractChange;
use Neos\Neos\Ui\Domain\Model\Feedback\Operations\ReloadContentOutOfBand;
use Neos\Neos\Ui\Domain\Model\Feedback\Operations\UpdateNodeInfo;
use Neos\Neos\Ui\Domain\Model\RenderedNodeDomAddress;
use Neos\Neos\Ui\Domain\Service\NodePropertyConversionService;
use Neos\Neos\Utility\NodeTypeWithFallbackProvider;

/**
 * Changes a property on a node
 * @internal These objects internally reflect possible operations made by the Neos.Ui.
 *           They are sorely an implementation detail. You should not use them!
 *           Please look into the php command API of the Neos CR instead.
 */
class Property extends AbstractChange
{
    use NodeTypeWithFallbackProvider;

    #[Flow\Inject]
    protected ContentRepositoryRegistry $contentRepositoryRegistry;

    /**
     * @Flow\Inject
     * @var NodePropertyConversionService
     */
    protected $nodePropertyConversionService;

    /**
     * The node dom address
     */
    protected ?RenderedNodeDomAddress $nodeDomAddress = null;

    /**
     * The name of the property to be changed
     */
    protected ?string $propertyName = null;

    /**
     * The value, the property will be set to
     *
     * @var string|array<int|string,mixed>|null
     */
    protected string|array|null $value = null;

    /**
     * The change has been initiated from the inline editing
     */
    protected bool $isInline = false;

    public function setPropertyName(string $propertyName): void
    {
        $this->propertyName = $propertyName;
    }

    public function getPropertyName(): ?string
    {
        return $this->propertyName;
    }

    public function setNodeDomAddress(RenderedNodeDomAddress $nodeDomAddress = null): void
    {
        $this->nodeDomAddress = $nodeDomAddress;
    }

    public function getNodeDomAddress(): ?RenderedNodeDomAddress
    {
        return $this->nodeDomAddress;
    }

    /**
     * @param string|array<int|string,mixed>|null $value
     */
    public function setValue(string|array|null $value): void
    {
        $this->value = $value;
    }

    /**
     * @return string|array<int|string,mixed>|null
     */
    public function getValue(): string|array|null
    {
        return $this->value;
    }

    public function setIsInline(bool $isInline): void
    {
        $this->isInline = $isInline;
    }

    public function getIsInline(): bool
    {
        return $this->isInline;
    }

    /**
     * Checks whether this change can be applied to the subject
     */
    public function canApply(): bool
    {
        if (is_null($this->subject) || is_null($this->subject->nodeType)) {
            return false;
        }
        $nodeType = $this->subject->nodeType;
        $propertyName = $this->getPropertyName();

        return $nodeType->hasProperty($propertyName) || $nodeType->hasReference($propertyName);
    }

    /**
     * Applies this change
     *
     * @throws ContentStreamDoesNotExistYet
     * @throws NodeAggregatesTypeIsAmbiguous
     * @throws DimensionSpacePointNotFound
     * @throws \Exception
     */
    public function apply(): void
    {
        $subject = $this->subject;
        $propertyName = $this->getPropertyName();
        if (is_null($subject) || is_null($propertyName) || $this->canApply() === false) {
            return;
        }

        $workspace = $this->contentRepositoryRegistry->get($this->subject->subgraphIdentity->contentRepositoryId)
            ->getWorkspaceFinder()->findOneByCurrentContentStreamId($subject->subgraphIdentity->contentStreamId);
        if (!$workspace) {
            throw new \Exception(
                'Could not find workspace for content stream "' . $subject->subgraphIdentity->contentStreamId->value . '"',
                1699008140
            );
        }

        $commandResult = match (true) {
            $this->getNodeType($subject)->hasReference($propertyName) => $this->handleNodeReferenceChange($workspace, $subject, $propertyName),
            // todo create custom 'changes' for these special cases
            // we continue to use the underscore logic in the Neos Ui code base as the JS-client code works this way
            $propertyName === '_nodeType' => $this->handleNodeTypeChange($workspace, $subject, $propertyName),
            $propertyName === '_hidden' => $this->handleHiddenPropertyChange($workspace, $subject, $propertyName),
            default => $this->handlePropertyChange($workspace, $subject, $propertyName)
        };

        $commandResult->block();
        $this->createFeedback($subject);
    }

    private function createFeedback(Node $subject): void
    {
        $propertyName = $this->getPropertyName();

        // We have to refetch the Node after modifications because its a read-only model
        // These 'Change' classes have been designed with mutable Neos < 9 Nodes and thus this might seem hacky 
        // When fully redesigning the Neos Ui php integration this will fixed
        $subgraph = $this->contentRepositoryRegistry->subgraphForNode($subject);
        $originalNodeAggregateId = $subject->nodeAggregateId;
        $node = $subgraph->findNodeById($originalNodeAggregateId);
        if (is_null($node)) {
            throw new \InvalidArgumentException(
                'Cannot apply Property on missing node ' . $originalNodeAggregateId->value,
                1645560836
            );
        }

        $this->updateWorkspaceInfo();
        $parentNode = $subgraph->findParentNode($node->nodeAggregateId);

        // This might be needed to update node label and other things that we can calculate only on the server
        $updateNodeInfo = new UpdateNodeInfo();
        $updateNodeInfo->setNode($node);
        $this->feedbackCollection->add($updateNodeInfo);

        $reloadIfChangedConfigurationPathForProperty = sprintf('properties.%s.ui.reloadIfChanged', $propertyName);
        $reloadIfChangedConfigurationPathForReference = sprintf('references.%s.ui.reloadIfChanged', $propertyName);
        if (!$this->getIsInline()
            && (
                $this->getNodeType($node)->getConfiguration($reloadIfChangedConfigurationPathForProperty)
                || $this->getNodeType($node)->getConfiguration($reloadIfChangedConfigurationPathForReference)
            )
        ) {
            if ($this->getNodeDomAddress() && $this->getNodeDomAddress()->getFusionPath()
                && $parentNode
                && $this->getNodeType($parentNode)->isOfType('Neos.Neos:ContentCollection')) {
                $reloadContentOutOfBand = new ReloadContentOutOfBand();
                $reloadContentOutOfBand->setNode($node);
                $reloadContentOutOfBand->setNodeDomAddress($this->getNodeDomAddress());
                $this->feedbackCollection->add($reloadContentOutOfBand);
            } else {
                $this->reloadDocument($node);
            }
        }

        $reloadPageIfChangedConfigurationPathForProperty = sprintf('properties.%s.ui.reloadPageIfChanged', $propertyName);
        $reloadPageIfChangedConfigurationPathForReference = sprintf('references.%s.ui.reloadPageIfChanged', $propertyName);
        if (!$this->getIsInline()
            && (
                $this->getNodeType($node)->getConfiguration($reloadPageIfChangedConfigurationPathForProperty)
                || $this->getNodeType($node)->getConfiguration($reloadPageIfChangedConfigurationPathForReference)
            )
        ) {
            $this->reloadDocument($node);
        }
    }

    private function handleNodeReferenceChange(Workspace $workspace, Node $subject, string $propertyName): CommandResult
    {
        $contentRepository = $this->contentRepositoryRegistry->get($subject->subgraphIdentity->contentRepositoryId);
        $value = $this->getValue();

        if (!is_array($value)) {
            $value = [$value];
        }

        $value = array_filter($value, fn ($v) => is_string($v) && !empty($v));
        $destinationNodeAggregateIds = array_values($value);

        return $contentRepository->handle(
            SetNodeReferences::create(
                $workspace->workspaceName,
                $subject->nodeAggregateId,
                $subject->originDimensionSpacePoint,
                ReferenceName::fromString($propertyName),
                NodeReferencesToWrite::fromNodeAggregateIds(NodeAggregateIds::fromArray($destinationNodeAggregateIds))
            )
        );
    }

    private function handleHiddenPropertyChange(Workspace $workspace, Node $subject, string $propertyName): CommandResult
    {
        $value = $this->nodePropertyConversionService->convert(
            $this->getNodeType($subject)->getPropertyType($propertyName),
            $this->getValue()
        );

        $contentRepository = $this->contentRepositoryRegistry->get($subject->subgraphIdentity->contentRepositoryId);

        $command = EnableNodeAggregate::create(
            $workspace->workspaceName,
            $subject->nodeAggregateId,
            $subject->originDimensionSpacePoint->toDimensionSpacePoint(),
            NodeVariantSelectionStrategy::STRATEGY_ALL_SPECIALIZATIONS
        );

        if ($value === true) {
            $command = DisableNodeAggregate::create(
                $workspace->workspaceName,
                $subject->nodeAggregateId,
                $subject->originDimensionSpacePoint->toDimensionSpacePoint(),
                NodeVariantSelectionStrategy::STRATEGY_ALL_SPECIALIZATIONS
            );
        }

        return $contentRepository->handle($command);
    }

    private function handleNodeTypeChange(Workspace $workspace, Node $subject, string $propertyName): CommandResult
    {
        $contentRepository = $this->contentRepositoryRegistry->get($subject->subgraphIdentity->contentRepositoryId);
        $value = $this->nodePropertyConversionService->convert(
            $this->getNodeType($subject)->getPropertyType($propertyName),
            $this->getValue()
        );

        return $contentRepository->handle(
            ChangeNodeAggregateType::create(
                $workspace->workspaceName,
                $subject->nodeAggregateId,
                NodeTypeName::fromString($value),
                NodeAggregateTypeChangeChildConstraintConflictResolutionStrategy::STRATEGY_DELETE
            )
        );
    }

    private function handlePropertyChange(Workspace $workspace, Node $subject, string $propertyName): CommandResult
    {
        $contentRepository = $this->contentRepositoryRegistry->get($subject->subgraphIdentity->contentRepositoryId);
        $value = $this->nodePropertyConversionService->convert(
            $this->getNodeType($subject)->getPropertyType($propertyName),
            $this->getValue()
        );

        $originDimensionSpacePoint = $subject->originDimensionSpacePoint;
        if (!$subject->subgraphIdentity->dimensionSpacePoint->equals($originDimensionSpacePoint)) {
            $originDimensionSpacePoint = OriginDimensionSpacePoint::fromDimensionSpacePoint($subject->subgraphIdentity->dimensionSpacePoint);
            // if origin dimension space point != current DSP -> translate transparently (matching old behavior)
            $contentRepository->handle(
                CreateNodeVariant::create(
                    $workspace->workspaceName,
                    $subject->nodeAggregateId,
                    $subject->originDimensionSpacePoint,
                    $originDimensionSpacePoint
                )
            )->block();
        }

        return $contentRepository->handle(
            SetNodeProperties::create(
                $workspace->workspaceName,
                $subject->nodeAggregateId,
                $originDimensionSpacePoint,
                PropertyValuesToWrite::fromArray(
                    [
                        $propertyName => $value
                    ]
                )
            )
        );
    }
}
