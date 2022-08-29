<?php

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

use Neos\ContentRepository\Core\Projection\ContentGraph\Node;
use Neos\ContentRepository\Core\DimensionSpace\OriginDimensionSpacePoint;
use Neos\ContentRepository\Core\SharedModel\Node\NodeName;
use Neos\ContentRepository\Core\Feature\NodeDuplication\Command\CopyNodesRecursively;
use Neos\ContentRepository\Core\SharedModel\User\UserIdentifier;

class CopyInto extends AbstractStructuralChange
{
    protected ?string $parentContextPath;

    protected ?Node $cachedParentNode;

    public function setParentContextPath(string $parentContextPath): void
    {
        $this->parentContextPath = $parentContextPath;
    }

    public function getParentNode(): ?Node
    {
        if (!isset($this->cachedParentNode)) {
            $this->cachedParentNode = $this->parentContextPath
                ? $this->nodeService->getNodeFromContextPath($this->parentContextPath, $this->getSubject()->subgraphIdentity->contentRepositoryIdentifier)
                : null;
        }

        return $this->cachedParentNode;
    }

    /**
     * "Subject" is the to-be-copied node; the "parent" node is the new parent
     */
    public function canApply(): bool
    {
        $parentNode = $this->getParentNode();

        return $this->subject
            && $parentNode
            && $this->isNodeTypeAllowedAsChildNode($parentNode, $this->subject->nodeType);
    }

    public function getMode(): string
    {
        return 'into';
    }

    /**
     * Applies this change
     */
    public function apply(): void
    {
        $subject = $this->getSubject();
        $parentNode = $this->getParentNode();
        if ($parentNode && $subject && $this->canApply()) {
            $targetNodeName = NodeName::fromString(uniqid('node-'));

            $contentRepository = $this->contentRepositoryRegistry->get($subject->subgraphIdentity->contentRepositoryIdentifier);
            $command = CopyNodesRecursively::createFromSubgraphAndStartNode(
                $contentRepository->getContentGraph()->getSubgraph(
                    $subject->subgraphIdentity->contentStreamIdentifier,
                    $subject->subgraphIdentity->dimensionSpacePoint,
                    $subject->subgraphIdentity->visibilityConstraints
                ),
                $subject,
                OriginDimensionSpacePoint::fromDimensionSpacePoint($subject->subgraphIdentity->dimensionSpacePoint),
                UserIdentifier::forSystemUser(), // TODO
                $parentNode->nodeAggregateIdentifier,
                null,
                $targetNodeName
            );
            $contentRepository->handle($command)->block();

            $newlyCreatedNode = $this->contentRepositoryRegistry->subgraphForNode($parentNode)
                ->findChildNodeConnectedThroughEdgeName(
                    $parentNode->nodeAggregateIdentifier,
                    $targetNodeName
                );
            $this->finish($newlyCreatedNode);
            // NOTE: we need to run "finish" before "addNodeCreatedFeedback"
            // to ensure the new node already exists when the last feedback is processed
            $this->addNodeCreatedFeedback($newlyCreatedNode);
        }
    }
}
