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

namespace Neos\Neos\Ui\LinkEditor\Application\GetChildrenForTreeNode;

use Neos\ContentRepository\Core\DimensionSpace\DimensionSpacePoint;
use Neos\ContentRepository\Core\NodeType\NodeTypeNames;
use Neos\ContentRepository\Core\SharedModel\ContentRepository\ContentRepositoryId;
use Neos\ContentRepository\Core\SharedModel\Node\NodeAggregateId;
use Neos\ContentRepository\Core\SharedModel\Workspace\WorkspaceName;
use Neos\Flow\Annotations as Flow;

/**
 * @internal
 */
#[Flow\Proxy(false)]
final class GetChildrenForTreeNodeQuery
{
    public function __construct(
        public readonly ContentRepositoryId $contentRepositoryId,
        public readonly WorkspaceName $workspaceName,
        public readonly DimensionSpacePoint $dimensionSpacePoint,
        public readonly NodeAggregateId $treeNodeId,
        public readonly string $nodeTypeFilter,
        public readonly NodeTypeNames $linkableNodeTypes,
    ) {
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

        isset($array['treeNodeId'])
            or throw new \InvalidArgumentException('Tree node id must be set');
        is_string($array['treeNodeId'])
            or throw new \InvalidArgumentException('Tree node id must be a string');

        !isset($array['nodeTypeFilter']) or is_string($array['nodeTypeFilter'])
            or throw new \InvalidArgumentException('Node type filter must be a string');

        !isset($array['linkableNodeTypes']) or is_array($array['linkableNodeTypes'])
            or throw new \InvalidArgumentException('Linkable node types must be an array');

        return new self(
            contentRepositoryId: ContentRepositoryId::fromString($array['contentRepositoryId']),
            workspaceName: WorkspaceName::fromString($array['workspaceName']),
            dimensionSpacePoint: DimensionSpacePoint::fromLegacyDimensionArray($array['dimensionValues'] ?? []),
            treeNodeId: NodeAggregateId::fromString($array['treeNodeId']),
            nodeTypeFilter: $array['nodeTypeFilter'] ?? '',
            linkableNodeTypes: NodeTypeNames::fromStringArray($array['linkableNodeTypes'] ?? []),
        );
    }
}
