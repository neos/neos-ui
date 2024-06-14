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

namespace Neos\Neos\Ui\Application\ReloadNodes;

use Neos\ContentRepository\Core\DimensionSpace\DimensionSpacePoint;
use Neos\ContentRepository\Core\SharedModel\ContentRepository\ContentRepositoryId;
use Neos\ContentRepository\Core\SharedModel\Node\NodeAggregateId;
use Neos\ContentRepository\Core\SharedModel\Node\NodeAggregateIds;
use Neos\ContentRepository\Core\SharedModel\Workspace\WorkspaceName;
use Neos\Flow\Annotations as Flow;

/**
 * The application layer level query DTO to find all nodes the UI needs
 * to refresh its in-memory node cache
 *
 * @internal for communication within the Neos UI only
 */
#[Flow\Proxy(false)]
final readonly class ReloadNodesQuery
{
    public function __construct(
        public ContentRepositoryId $contentRepositoryId,
        public WorkspaceName $workspaceName,
        public DimensionSpacePoint $dimensionSpacePoint,
        public NodeAggregateId $siteId,
        public NodeAggregateId $documentId,
        public NodeAggregateIds $ancestorsOfDocumentIds,
        public NodeAggregateIds $toggledNodesIds,
        public NodeAggregateIds $clipboardNodesIds
    ) {
    }

    /**
     * @param array<mixed> $values
     */
    public static function fromArray(array $values): self
    {
        return new self(
            contentRepositoryId: ContentRepositoryId::fromString($values['contentRepositoryId']),
            workspaceName: WorkspaceName::fromString($values['workspaceName']),
            dimensionSpacePoint: DimensionSpacePoint::fromLegacyDimensionArray($values['dimensionSpacePoint']),
            siteId: NodeAggregateId::fromString($values['siteId']),
            documentId: NodeAggregateId::fromString($values['documentId']),
            ancestorsOfDocumentIds: NodeAggregateIds::fromArray($values['ancestorsOfDocumentIds']),
            toggledNodesIds: NodeAggregateIds::fromArray($values['toggledNodesIds']),
            clipboardNodesIds: NodeAggregateIds::fromArray($values['clipboardNodesIds'])
        );
    }
}
