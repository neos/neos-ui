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

use Neos\ContentRepository\Core\Feature\NodeReferencing\Command\SetNodeReferences;
use Neos\ContentRepository\Core\Feature\NodeReferencing\Dto\NodeReferencesForName;
use Neos\ContentRepository\Core\Feature\NodeReferencing\Dto\NodeReferencesToWrite;
use Neos\ContentRepository\Core\SharedModel\Node\NodeAggregateIds;
use Neos\ContentRepository\Core\SharedModel\Node\ReferenceName;
use Neos\Neos\Ui\Domain\Model\AbstractChange;
use Neos\Neos\Ui\Domain\Model\Feedback\Operations\ReloadContentOutOfBand;
use Neos\Neos\Ui\Domain\Model\Feedback\Operations\UpdateNodeInfo;
use Neos\Neos\Ui\Domain\Model\RenderedNodeDomAddress;

/**
 * Changes a reference on a node
 * @internal These objects internally reflect possible operations made by the Neos.Ui.
 *           They are sorely an implementation detail. You should not use them!
 *           Please look into the php command API of the Neos CR instead.
 */
class Reference extends AbstractChange
{
    public function __construct(
        // private Node $subject, lol todo
        private string $referenceName,
        private ?RenderedNodeDomAddress $nodeDomAddress,
        private array $serializedReferences
    ) {
    }

    public function canApply(): bool
    {
        $nodeType = $this->getNodeType($this->subject);
        if (!$nodeType) {
            return false;
        }
        return $nodeType->hasReference($this->referenceName);
    }

    public function apply(): void
    {
        if ($this->canApply() === false) {
            return;
        }

        $this->handleNodeReferenceChange();
        $this->createFeedback();
    }

    private function createFeedback(): void
    {
        $subject = $this->subject;

        // We have to refetch the Node after modifications because its a read-only model
        // These 'Change' classes have been designed with mutable Neos < 9 Nodes and thus this might seem hacky
        // When fully redesigning the Neos Ui php integration this will fixed
        $subgraph = $this->contentRepositoryRegistry->subgraphForNode($subject);
        $originalNodeAggregateId = $subject->aggregateId;
        $node = $subgraph->findNodeById($originalNodeAggregateId);
        if (is_null($node)) {
            throw new \InvalidArgumentException(
                'Cannot apply reference on missing node ' . $originalNodeAggregateId->value,
                1645560836
            );
        }

        $this->updateWorkspaceInfo();
        $parentNode = $subgraph->findParentNode($node->aggregateId);

        // This might be needed to update node label and other things that we can calculate only on the server
        $updateNodeInfo = new UpdateNodeInfo();
        $updateNodeInfo->setNode($node);
        $this->feedbackCollection->add($updateNodeInfo);

        $reloadIfChangedConfigurationPathForReference = sprintf('references.%s.ui.reloadIfChanged', $this->referenceName);
        if (
            $this->getNodeType($node)?->getConfiguration($reloadIfChangedConfigurationPathForReference)
        ) {
            if (!$this->nodeDomAddress) {
                $this->reloadDocument($node);
            } elseif ($this->nodeDomAddress->getFusionPath()
                && $parentNode
                && $this->getNodeType($parentNode)?->isOfType('Neos.Neos:ContentCollection')) {
                $reloadContentOutOfBand = new ReloadContentOutOfBand();
                $reloadContentOutOfBand->setNode($node);
                $reloadContentOutOfBand->setNodeDomAddress($this->nodeDomAddress);
                $this->feedbackCollection->add($reloadContentOutOfBand);
            } else {
                $this->reloadDocument($node);
            }
        }

        $reloadPageIfChangedConfigurationPathForReference = sprintf('references.%s.ui.reloadPageIfChanged', $this->referenceName);
        if (
            $this->getNodeType($node)?->getConfiguration($reloadPageIfChangedConfigurationPathForReference)
        ) {
            $this->reloadDocument($node);
        }
    }

    private function handleNodeReferenceChange(): void
    {
        $contentRepository = $this->contentRepositoryRegistry->get($this->subject->contentRepositoryId);

        $contentRepository->handle(
            SetNodeReferences::create(
                $this->subject->workspaceName,
                $this->subject->aggregateId,
                $this->subject->originDimensionSpacePoint,
                NodeReferencesToWrite::create(
                    NodeReferencesForName::fromTargets(
                        ReferenceName::fromString($this->referenceName),
                        NodeAggregateIds::fromArray($this->serializedReferences)
                    )
                )
            )
        );
    }
}
