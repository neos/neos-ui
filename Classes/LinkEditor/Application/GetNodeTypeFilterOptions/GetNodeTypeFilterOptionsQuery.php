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

namespace Neos\Neos\Ui\LinkEditor\Application\GetNodeTypeFilterOptions;

use Neos\ContentRepository\Core\Projection\ContentGraph\Filter\NodeType\NodeTypeCriteria;
use Neos\ContentRepository\Core\SharedModel\ContentRepository\ContentRepositoryId;
use Neos\Flow\Annotations as Flow;

/**
 * @internal
 */
#[Flow\Proxy(false)]
final class GetNodeTypeFilterOptionsQuery
{
    public function __construct(
        public readonly ContentRepositoryId $contentRepositoryId,
        public readonly NodeTypeCriteria $baseNodeTypeFilter,
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

        isset($array['baseNodeTypeFilter'])
            or throw new \InvalidArgumentException('Base node type filter must be set');
        is_string($array['baseNodeTypeFilter'])
            or throw new \InvalidArgumentException('Base node type filter must be a string');

        return new self(
            contentRepositoryId: ContentRepositoryId::fromString($array['contentRepositoryId']),
            baseNodeTypeFilter: NodeTypeCriteria::fromFilterString($array['baseNodeTypeFilter']),
        );
    }
}
