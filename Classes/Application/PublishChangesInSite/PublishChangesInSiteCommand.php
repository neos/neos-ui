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

namespace Neos\Neos\Ui\Application\PublishChangesInSite;

use Neos\ContentRepository\Core\DimensionSpace\DimensionSpacePoint;
use Neos\ContentRepository\Core\SharedModel\ContentRepository\ContentRepositoryId;
use Neos\ContentRepository\Core\SharedModel\Node\NodeAggregateId;
use Neos\ContentRepository\Core\SharedModel\Workspace\WorkspaceName;
use Neos\Flow\Annotations as Flow;

/**
 * The application layer level command DTO to communicate publication of
 * all changes recorded for a given site
 *
 * @internal for communication within the Neos UI only
 */
#[Flow\Proxy(false)]
final readonly class PublishChangesInSiteCommand
{
    public function __construct(
        public ContentRepositoryId $contentRepositoryId,
        public WorkspaceName $workspaceName,
        public NodeAggregateId $siteId,
        public ?DimensionSpacePoint $preferredDimensionSpacePoint,
    ) {
    }

    /**
     * @param array{contentRepositoryId:string,workspaceName:string,siteId:string,preferredDimensionSpacePoint?:array<string,string[]>} $values
     */
    public static function fromArray(array $values): self
    {
        return new self(
            ContentRepositoryId::fromString($values['contentRepositoryId']),
            WorkspaceName::fromString($values['workspaceName']),
            NodeAggregateId::fromString($values['siteId']),
            isset($values['preferredDimensionSpacePoint']) && !empty($values['preferredDimensionSpacePoint'])
                ? DimensionSpacePoint::fromLegacyDimensionArray($values['preferredDimensionSpacePoint'])
                : null,
        );
    }
}
