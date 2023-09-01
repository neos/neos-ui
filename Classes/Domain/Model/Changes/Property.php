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
use Neos\ContentRepository\Core\SharedModel\Exception\ContentStreamDoesNotExistYet;
use Neos\ContentRepository\Core\SharedModel\Exception\NodeAggregatesTypeIsAmbiguous;
use Neos\ContentRepository\Core\SharedModel\Node\NodeAggregateIds;
use Neos\ContentRepository\Core\SharedModel\Node\NodeVariantSelectionStrategy;
use Neos\ContentRepository\Core\SharedModel\Node\ReferenceName;
use Neos\Flow\Annotations as Flow;
use Neos\Neos\Domain\Service\NodeTypeNameFactory;
use Neos\Neos\Ui\Domain\Model\AbstractChange;
use Neos\Neos\Ui\Domain\Model\Feedback\Operations\ReloadContentOutOfBand;
use Neos\Neos\Ui\Domain\Model\Feedback\Operations\UpdateNodeInfo;
use Neos\Neos\Ui\Domain\Model\RenderedNodeDomAddress;
use Neos\Neos\Ui\Domain\Service\NodePropertyConversionService;

/** @codingStandardsIgnoreStart */
/** @codingStandardsIgnoreEnd */

/**
 * Changes a property on a node
 */
class Property extends AbstractChange
{
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
        if (is_null($this->subject)) {
            return false;
        }
        $propertyName = $this->getPropertyName();
        $nodeTypeProperties = $this->getNodeType($this->subject)->getProperties();

        return isset($nodeTypeProperties[$propertyName]);
    }

    /**
     * Applies this change
     *
     * @throws ContentStreamDoesNotExistYet
     * @throws NodeAggregatesTypeIsAmbiguous
     * @throws DimensionSpacePointNotFound
     */
    public function apply(): void
    {
        $subject = $this->subject;
        $propertyName = $this->getPropertyName();
        if ($this->canApply() && !is_null($subject) && !is_null($propertyName)) {
            $contentRepository = $this->contentRepositoryRegistry->get($subject->subgraphIdentity->contentRepositoryId);

            $nodeType = $this->getNodeType($subject);
            $propertyType = $nodeType->getPropertyType($propertyName);

            // Use extra commands for reference handling
            if ($propertyType === 'reference' || $propertyType === 'references') {
                $value = $this->getValue();
                $destinationNodeAggregateIds = [];
                if ($propertyType === 'reference') {
                    if (is_string($value) && !empty($value)) {
                        $destinationNodeAggregateIds[] = $value;
                    }
                }

                if ($propertyType === 'references') {
                    /** @var array<int,string> $values */
                    $values = $value;
                    if (is_array($values)) {
                        foreach ($values as $singleNodeAggregateId) {
                            $destinationNodeAggregateIds[] = $singleNodeAggregateId;
                        }
                    }
                }

                $commandResult = $contentRepository->handle(
                    new SetNodeReferences(
                        $subject->subgraphIdentity->contentStreamId,
                        $subject->nodeAggregateId,
                        $subject->originDimensionSpacePoint,
                        ReferenceName::fromString($propertyName),
                        NodeReferencesToWrite::fromNodeAggregateIds(NodeAggregateIds::fromArray($destinationNodeAggregateIds))
                    )
                );
            } else {
                $value = $this->nodePropertyConversionService->convert(
                    $nodeType,
                    $propertyName,
                    $this->getValue()
                );

                if ($propertyName[0] !== '_' || $propertyName === '_hiddenInIndex') {
                    $originDimensionSpacePoint = $subject->originDimensionSpacePoint;
                    if (!$subject->subgraphIdentity->dimensionSpacePoint->equals($originDimensionSpacePoint)) {
                        $originDimensionSpacePoint = OriginDimensionSpacePoint::fromDimensionSpacePoint($subject->subgraphIdentity->dimensionSpacePoint);
                        // if origin dimension space point != current DSP -> translate transparently (matching old behavior)
                        $contentRepository->handle(
                            new CreateNodeVariant(
                                $subject->subgraphIdentity->contentStreamId,
                                $subject->nodeAggregateId,
                                $subject->originDimensionSpacePoint,
                                $originDimensionSpacePoint
                            )
                        )->block();
                    }
                    $commandResult = $contentRepository->handle(
                        new SetNodeProperties(
                            $subject->subgraphIdentity->contentStreamId,
                            $subject->nodeAggregateId,
                            $originDimensionSpacePoint,
                            PropertyValuesToWrite::fromArray(
                                [
                                    $propertyName => $value
                                ]
                            )
                        )
                    );
                } else {
                    // property starts with "_"
                    if ($propertyName === '_nodeType') {
                        $commandResult = $contentRepository->handle(
                            new ChangeNodeAggregateType(
                                $subject->subgraphIdentity->contentStreamId,
                                $subject->nodeAggregateId,
                                NodeTypeName::fromString($value),
                                NodeAggregateTypeChangeChildConstraintConflictResolutionStrategy::STRATEGY_DELETE
                            )
                        );
                    } elseif ($propertyName === '_hidden') {
                        if ($value === true) {
                            $commandResult = $contentRepository->handle(
                                new DisableNodeAggregate(
                                    $subject->subgraphIdentity->contentStreamId,
                                    $subject->nodeAggregateId,
                                    $subject->originDimensionSpacePoint->toDimensionSpacePoint(),
                                    NodeVariantSelectionStrategy::STRATEGY_ALL_SPECIALIZATIONS
                                )
                            );
                        } else {
                            // unhide
                            $commandResult = $contentRepository->handle(
                                new EnableNodeAggregate(
                                    $subject->subgraphIdentity->contentStreamId,
                                    $subject->nodeAggregateId,
                                    $subject->originDimensionSpacePoint->toDimensionSpacePoint(),
                                    NodeVariantSelectionStrategy::STRATEGY_ALL_SPECIALIZATIONS
                                )
                            );
                        }
                    } else {
                        throw new \Exception("TODO FIX");
                    }
                }
            }

            $commandResult->block();

            // !!! REMEMBER: we are not allowed to use $node anymore,
            // because it may have been modified by the commands above.
            // Thus, we need to re-fetch it (as a workaround; until we do not need this anymore)
            $subgraph = $this->contentRepositoryRegistry->subgraphForNode($subject);
            $originalNodeAggregateId = $subject->nodeAggregateId;
            $node = $subgraph->findNodeById($originalNodeAggregateId);
            if (is_null($node)) {
                throw new \InvalidArgumentException(
                    'Cannot apply Property on missing node ' . $originalNodeAggregateId->value,
                    1645560836
                );
            }
            $nodeType = $this->getNodeType($node);

            $this->updateWorkspaceInfo();
            $parentNode = $subgraph->findParentNode($node->nodeAggregateId);

            // This might be needed to update node label and other things that we can calculate only on the server
            $updateNodeInfo = new UpdateNodeInfo();
            $updateNodeInfo->setNode($node);
            $this->feedbackCollection->add($updateNodeInfo);

            $reloadIfChangedConfigurationPath = sprintf('properties.%s.ui.reloadIfChanged', $propertyName);
            if (!$this->getIsInline() && $nodeType->getConfiguration($reloadIfChangedConfigurationPath)) {
                if ($this->getNodeDomAddress() && $this->getNodeDomAddress()->getFusionPath()
                    && $parentNode
                    && $this->getNodeType($parentNode)->isOfType(NodeTypeNameFactory::NAME_CONTENT_COLLECTION)) {
                    $reloadContentOutOfBand = new ReloadContentOutOfBand();
                    $reloadContentOutOfBand->setNode($node);
                    $reloadContentOutOfBand->setNodeDomAddress($this->getNodeDomAddress());
                    $this->feedbackCollection->add($reloadContentOutOfBand);
                } else {
                    $this->reloadDocument($node);
                }
            }

            $reloadPageIfChangedConfigurationPath = sprintf('properties.%s.ui.reloadPageIfChanged', $propertyName);
            if (!$this->getIsInline()
                && $nodeType->getConfiguration($reloadPageIfChangedConfigurationPath)) {
                $this->reloadDocument($node);
            }
        }
    }
}
