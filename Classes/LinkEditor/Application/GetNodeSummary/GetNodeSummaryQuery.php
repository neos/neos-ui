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

namespace Neos\Neos\Ui\LinkEditor\Application\GetNodeSummary;

use Neos\ContentRepository\Core\DimensionSpace\DimensionSpacePoint;
use Neos\ContentRepository\Core\SharedModel\ContentRepository\ContentRepositoryId;
use Neos\ContentRepository\Core\SharedModel\Node\NodeAggregateId;
use Neos\ContentRepository\Core\SharedModel\Workspace\WorkspaceName;
use Neos\Flow\Annotations as Flow;

/**
 * @internal
 */
#[Flow\Proxy(false)]
final class GetNodeSummaryQuery
{
    public function __construct(
        public readonly ContentRepositoryId $contentRepositoryId,
        public readonly WorkspaceName $workspaceName,
        public readonly DimensionSpacePoint $dimensionSpacePoint,
        public readonly NodeAggregateId $nodeId,
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

        isset($array['nodeId'])
            or throw new \InvalidArgumentException('Node id must be set');
        is_string($array['nodeId'])
            or throw new \InvalidArgumentException('Node id must be a string');

        return new self(
            contentRepositoryId: ContentRepositoryId::fromString($array['contentRepositoryId']),
            workspaceName: WorkspaceName::fromString($array['workspaceName']),
            dimensionSpacePoint: DimensionSpacePoint::fromLegacyDimensionArray($array['dimensionValues'] ?? []),
            nodeId: NodeAggregateId::fromString($array['nodeId']),
        );
    }
}
