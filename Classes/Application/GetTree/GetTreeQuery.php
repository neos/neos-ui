<?php

/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

declare(strict_types=1);

namespace Neos\Neos\Ui\Application\GetTree;

use Neos\ContentRepository\Core\DimensionSpace\DimensionSpacePoint;
use Neos\ContentRepository\Core\SharedModel\ContentRepository\ContentRepositoryId;
use Neos\ContentRepository\Core\SharedModel\Node\NodeAddress;
use Neos\ContentRepository\Core\SharedModel\Node\NodeAggregateId;
use Neos\ContentRepository\Core\SharedModel\Workspace\WorkspaceName;
use Neos\Flow\Annotations as Flow;

/**
 * @internal
 */
#[Flow\Proxy(false)]
final class GetTreeQuery
{
    public function __construct(
        public readonly ContentRepositoryId $contentRepositoryId,
        public readonly WorkspaceName $workspaceName,
        public readonly DimensionSpacePoint $dimensionSpacePoint,
        public readonly NodeAggregateId $startingPoint,
        public readonly int $loadingDepth,
        public readonly string $baseNodeTypeFilter,
        public readonly ?string $narrowNodeTypeFilter,
        public readonly ?string $searchTerm,
        public readonly ?NodeAggregateId $selectedNodeId,
        // todo handle $toggledNodes
        // todo handle $clipboardNodesContextPaths
    ) {
        if ($this->loadingDepth < 0) {
            throw new \InvalidArgumentException(sprintf('Loading depth must not be negative, got %d', $this->loadingDepth), 1745164594);
        }
    }

    /**
     * @param array<string,mixed> $array
     */
    public static function fromArray(array $array): self
    {
        isset($array['startingPoint'])
            or throw new \InvalidArgumentException('StartingPoint must be set');
        is_string($array['startingPoint'])
            or throw new \InvalidArgumentException('StartingPoint must be a string');
        $startingPointNodeAddress = NodeAddress::fromJsonString($array['startingPoint']);

        isset($array['loadingDepth'])
            or throw new \InvalidArgumentException('Loading depth must be set');
        if (is_string($array['loadingDepth'])) {
            $array['loadingDepth'] = (int) $array['loadingDepth'];
        }
        is_int($array['loadingDepth'])
            or throw new \InvalidArgumentException('Loading depth must be an integer');

        isset($array['baseNodeTypeFilter'])
            or throw new \InvalidArgumentException('Base node type filter must be set');
        is_string($array['baseNodeTypeFilter'])
            or throw new \InvalidArgumentException('Base node type filter must be a string');

        !isset($array['narrowNodeTypeFilter']) or is_string($array['narrowNodeTypeFilter'])
            or throw new \InvalidArgumentException('Narrow node type filter must be a string');

        !isset($array['searchTerm']) or is_string($array['searchTerm'])
            or throw new \InvalidArgumentException('Search term must be a string');

        $selectedNodeId = null;
        if (isset($array['selectedNodeId'])) {
            is_string($array['selectedNodeId'])
                or throw new \InvalidArgumentException('Selected node id must be a string');
            $selectedNodeAddress =  NodeAddress::fromJsonString($array['selectedNodeId']);

            if (!$selectedNodeAddress->contentRepositoryId->equals($startingPointNodeAddress->contentRepositoryId)) {
                throw new \InvalidArgumentException('Selected node address and starting node address must be in the same content repository', 1750692165);
            }
            if (!$selectedNodeAddress->workspaceName->equals($startingPointNodeAddress->workspaceName)) {
                throw new \InvalidArgumentException('Selected node address and starting node address must be in the same workspace', 1750692165);
            }
            if (!$selectedNodeAddress->dimensionSpacePoint->equals($startingPointNodeAddress->dimensionSpacePoint)) {
                throw new \InvalidArgumentException('Selected node address and starting node address must be in the same dimension space', 1750692165);
            }

            $selectedNodeId = $selectedNodeAddress->aggregateId;
        }

        return new self(
            contentRepositoryId: $startingPointNodeAddress->contentRepositoryId,
            workspaceName: $startingPointNodeAddress->workspaceName,
            dimensionSpacePoint: $startingPointNodeAddress->dimensionSpacePoint,
            startingPoint: $startingPointNodeAddress->aggregateId,
            loadingDepth: $array['loadingDepth'],
            baseNodeTypeFilter: $array['baseNodeTypeFilter'],
            narrowNodeTypeFilter: $array['narrowNodeTypeFilter'] ?: null,
            searchTerm: $array['searchTerm'] ?: null,
            selectedNodeId: $selectedNodeId,
        );
    }
}
