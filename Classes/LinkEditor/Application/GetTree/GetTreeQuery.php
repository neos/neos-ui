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

namespace Neos\Neos\Ui\LinkEditor\Application\GetTree;

use Neos\ContentRepository\Core\DimensionSpace\DimensionSpacePoint;
use Neos\ContentRepository\Core\NodeType\NodeTypeNames;
use Neos\ContentRepository\Core\Projection\ContentGraph\AbsoluteNodePath;
use Neos\ContentRepository\Core\SharedModel\ContentRepository\ContentRepositoryId;
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
        public readonly NodeAggregateId|AbsoluteNodePath $startingPoint,
        public readonly int $loadingDepth,
        public readonly string $baseNodeTypeFilter,
        public readonly NodeTypeNames $linkableNodeTypes,
        public readonly string $narrowNodeTypeFilter,
        public readonly string $searchTerm,
        public readonly ?NodeAggregateId $selectedNodeId,
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
        isset($array['contentRepositoryId'])
            or throw new \InvalidArgumentException('Content Repository Id must be set');
        is_string($array['contentRepositoryId'])
            or throw new \InvalidArgumentException('Content Repository Id must be a string');

        isset($array['workspaceName'])
            or throw new \InvalidArgumentException('Workspace name must be set');
        is_string($array['workspaceName'])
            or throw new \InvalidArgumentException('Workspace name must be a string');

        isset($array['startingPoint'])
            or throw new \InvalidArgumentException('Starting point must be set');
        is_string($array['startingPoint'])
            or throw new \InvalidArgumentException('Starting point must be a string');

        isset($array['loadingDepth'])
            or throw new \InvalidArgumentException('Loading depth must be set');
        if (is_string($array['loadingDepth'])) {
            $array['loadingDepth'] = (int) $array['loadingDepth'];
        }
        is_int($array['loadingDepth'])
            or throw new \InvalidArgumentException('Loading depth must be an integer');

        !isset($array['baseNodeTypeFilter']) or is_string($array['baseNodeTypeFilter'])
            or throw new \InvalidArgumentException('Base node type filter must be a string');

        !isset($array['linkableNodeTypes']) or is_array($array['linkableNodeTypes'])
            or throw new \InvalidArgumentException('Linkable node types must be an array');

        !isset($array['narrowNodeTypeFilter']) or is_string($array['narrowNodeTypeFilter'])
            or throw new \InvalidArgumentException('Narrow node type filter must be a string');

        !isset($array['searchTerm']) or is_string($array['searchTerm'])
            or throw new \InvalidArgumentException('Search term must be a string');

        !isset($array['selectedNodeId']) or is_string($array['selectedNodeId'])
            or throw new \InvalidArgumentException('Selected node id term must be a string');

        return new self(
            contentRepositoryId: ContentRepositoryId::fromString($array['contentRepositoryId']),
            workspaceName: WorkspaceName::fromString($array['workspaceName']),
            dimensionSpacePoint: DimensionSpacePoint::fromLegacyDimensionArray($array['dimensionValues'] ?? []),
            startingPoint: NodeAggregateId::tryFromString($array['startingPoint']) ?? AbsoluteNodePath::fromString($array['startingPoint']),
            loadingDepth: $array['loadingDepth'],
            baseNodeTypeFilter: $array['baseNodeTypeFilter'] ?? '',
            linkableNodeTypes: NodeTypeNames::fromStringArray($array['linkableNodeTypes'] ?? []),
            narrowNodeTypeFilter: $array['narrowNodeTypeFilter'] ?? '',
            searchTerm: $array['searchTerm'] ?? '',
            selectedNodeId: isset($array['selectedNodeId'])
                ? NodeAggregateId::fromString($array['selectedNodeId'])
                : null,
        );
    }
}
