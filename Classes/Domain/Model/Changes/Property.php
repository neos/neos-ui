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

use Neos\ContentRepository\DimensionSpace\DimensionSpace\Exception\DimensionSpacePointNotFound;
use Neos\ContentRepository\Feature\Common\Exception\ContentStreamDoesNotExistYet;
use Neos\ContentRepository\Feature\Common\Exception\NodeAggregatesTypeIsAmbiguous;
use Neos\ContentRepository\Feature\Common\NodeReferencesToWrite;
use Neos\ContentRepository\Feature\Common\NodeVariantSelectionStrategy;
use Neos\ContentRepository\Feature\Common\PropertyValuesToWrite;
use Neos\ContentRepository\Feature\NodeDisabling\Command\DisableNodeAggregate;
use Neos\ContentRepository\Feature\NodeDisabling\Command\EnableNodeAggregate;
use Neos\ContentRepository\Feature\NodeModification\Command\SetNodeProperties;
use Neos\ContentRepository\Feature\NodeReferencing\Command\SetNodeReferences;
use Neos\ContentRepository\Feature\NodeTypeChange\Command\ChangeNodeAggregateType;
use Neos\ContentRepository\Feature\NodeTypeChange\Command\NodeAggregateTypeChangeChildConstraintConflictResolutionStrategy;
use Neos\ContentRepository\Feature\NodeVariation\Command\CreateNodeVariant;
use Neos\ContentRepository\SharedModel\Node\NodeAggregateIdentifiers;
use Neos\ContentRepository\SharedModel\Node\OriginDimensionSpacePoint;
use Neos\ContentRepository\SharedModel\Node\PropertyName;
use Neos\ContentRepository\SharedModel\NodeType\NodeTypeName;
use Neos\Flow\Annotations as Flow;
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
        $nodeType = $this->subject->nodeType;
        $propertyName = $this->getPropertyName();
        $nodeTypeProperties = $nodeType->getProperties();

        return isset($nodeTypeProperties[$propertyName]);
    }

    /**
     * Applies this change
     *
     * @throws \Neos\ContentRepository\Exception\NodeException
     * @throws ContentStreamDoesNotExistYet
     * @throws NodeAggregatesTypeIsAmbiguous
     * @throws DimensionSpacePointNotFound
     */
    public function apply(): void
    {
        $subject = $this->subject;
        $propertyName = $this->getPropertyName();
        if ($this->canApply() && !is_null($subject) && !is_null($propertyName)) {
            $contentRepository = $this->contentRepositoryRegistry->get($subject->subgraphIdentity->contentRepositoryIdentifier);

            $propertyType = $subject->nodeType->getPropertyType($propertyName);
            $userIdentifier = $this->getInitiatingUserIdentifier();

            // Use extra commands for reference handling
            if ($propertyType === 'reference' || $propertyType === 'references') {
                $value = $this->getValue();
                $destinationNodeAggregateIdentifiers = [];
                if ($propertyType === 'reference') {
                    if (is_string($value) && !empty($value)) {
                        $destinationNodeAggregateIdentifiers[] = $value;
                    }
                }

                if ($propertyType === 'references') {
                    /** @var array<int,string> $values */
                    $values = $value;
                    if (is_array($values)) {
                        foreach ($values as $singleNodeAggregateIdentifier) {
                            $destinationNodeAggregateIdentifiers[] = $singleNodeAggregateIdentifier;
                        }
                    }
                }

                $commandResult = $contentRepository->handle(
                    new SetNodeReferences(
                        $subject->subgraphIdentity->contentStreamIdentifier,
                        $subject->nodeAggregateIdentifier,
                        $subject->originDimensionSpacePoint,
                        PropertyName::fromString($propertyName),
                        NodeReferencesToWrite::fromNodeAggregateIdentifiers(NodeAggregateIdentifiers::fromArray($destinationNodeAggregateIdentifiers)),
                        $this->getInitiatingUserIdentifier()
                    )
                );
            } else {
                $value = $this->nodePropertyConversionService->convert(
                    $subject->nodeType,
                    $propertyName,
                    $this->getValue()
                );

                // TODO: Make changing the node type a separated, specific/defined change operation.
                if ($propertyName[0] !== '_' || $propertyName === '_hiddenInIndex') {
                    $originDimensionSpacePoint = $subject->originDimensionSpacePoint;
                    if (!$subject->subgraphIdentity->dimensionSpacePoint->equals($originDimensionSpacePoint)) {
                        $originDimensionSpacePoint = OriginDimensionSpacePoint::fromDimensionSpacePoint($subject->subgraphIdentity->dimensionSpacePoint);
                        // if origin dimension space point != current DSP -> translate transparently (matching old behavior)
                        $contentRepository->handle(
                            new CreateNodeVariant(
                                $subject->subgraphIdentity->contentStreamIdentifier,
                                $subject->nodeAggregateIdentifier,
                                $subject->originDimensionSpacePoint,
                                $originDimensionSpacePoint,
                                $this->getInitiatingUserIdentifier()
                            )
                        )->block();
                    }
                    $commandResult = $contentRepository->handle(
                        new SetNodeProperties(
                            $subject->subgraphIdentity->contentStreamIdentifier,
                            $subject->nodeAggregateIdentifier,
                            $originDimensionSpacePoint,
                            PropertyValuesToWrite::fromArray(
                                [
                                    $propertyName => $value
                                ]
                            ),
                            $this->getInitiatingUserIdentifier()
                        )
                    );
                } else {
                    // property starts with "_"
                    if ($propertyName === '_nodeType') {
                        $commandResult = $contentRepository->handle(
                            $command = new ChangeNodeAggregateType(
                                $subject->subgraphIdentity->contentStreamIdentifier,
                                $subject->nodeAggregateIdentifier,
                                NodeTypeName::fromString($value),
                                NodeAggregateTypeChangeChildConstraintConflictResolutionStrategy::STRATEGY_DELETE,
                                $userIdentifier
                            )
                        );
                    } elseif ($propertyName === '_hidden') {
                        if ($value === true) {
                            $commandResult = $contentRepository->handle(
                                new DisableNodeAggregate(
                                    $subject->subgraphIdentity->contentStreamIdentifier,
                                    $subject->nodeAggregateIdentifier,
                                    $subject->originDimensionSpacePoint->toDimensionSpacePoint(),
                                    NodeVariantSelectionStrategy::STRATEGY_ALL_SPECIALIZATIONS,
                                    $userIdentifier
                                )
                            );
                        } else {
                            // unhide
                            $commandResult = $contentRepository->handle(
                                new EnableNodeAggregate(
                                    $subject->subgraphIdentity->contentStreamIdentifier,
                                    $subject->nodeAggregateIdentifier,
                                    $subject->originDimensionSpacePoint->toDimensionSpacePoint(),
                                    NodeVariantSelectionStrategy::STRATEGY_ALL_SPECIALIZATIONS,
                                    $userIdentifier
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
            $originalNodeAggregateIdentifier = $subject->nodeAggregateIdentifier;
            $node = $subgraph->findNodeByNodeAggregateIdentifier($originalNodeAggregateIdentifier);
            if (is_null($node)) {
                throw new \InvalidArgumentException(
                    'Cannot apply Property on missing node ' . $originalNodeAggregateIdentifier,
                    1645560836
                );
            }

            $this->updateWorkspaceInfo();
            $parentNode = $subgraph->findParentNode($node->nodeAggregateIdentifier);

            $reloadIfChangedConfigurationPath = sprintf('properties.%s.ui.reloadIfChanged', $propertyName);
            if (!$this->getIsInline() && $node->nodeType->getConfiguration($reloadIfChangedConfigurationPath)) {
                if ($this->getNodeDomAddress() && $this->getNodeDomAddress()->getFusionPath()
                    && $parentNode
                    && $parentNode->nodeType->isOfType('Neos.Neos:ContentCollection')) {
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
                && $node->nodeType->getConfiguration($reloadPageIfChangedConfigurationPath)) {
                $this->reloadDocument($node);
            }

            // This might be needed to update node label and other things that we can calculate only on the server
            $updateNodeInfo = new UpdateNodeInfo();
            $updateNodeInfo->setNode($node);
            $this->feedbackCollection->add($updateNodeInfo);
        }
    }
}
