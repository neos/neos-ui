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

namespace Neos\Neos\Ui\LinkEditor\Infrastructure\ESCR;

use Neos\ContentRepository\Core\DimensionSpace\DimensionSpacePoint;
use Neos\ContentRepository\Core\SharedModel\ContentRepository\ContentRepositoryId;
use Neos\ContentRepository\Core\SharedModel\Workspace\WorkspaceName;
use Neos\ContentRepositoryRegistry\ContentRepositoryRegistry;
use Neos\Flow\Annotations as Flow;
use Neos\Neos\Domain\NodeLabel\NodeLabelGeneratorInterface;
use Neos\Neos\Domain\SubtreeTagging\NeosVisibilityConstraints;

/**
 * @internal
 */
#[Flow\Scope("singleton")]
final class NodeServiceFactory
{
    #[Flow\Inject]
    protected ContentRepositoryRegistry $contentRepositoryRegistry;

    #[Flow\Inject]
    protected NodeLabelGeneratorInterface $nodeLabelGenerator;

    public function create(
        ContentRepositoryId $contentRepositoryId,
        WorkspaceName $workspaceName,
        DimensionSpacePoint $dimensionSpacePoint,
    ): NodeService {
        $contentRepository = $this->contentRepositoryRegistry
            ->get($contentRepositoryId);
        $subgraph = $contentRepository
            ->getContentGraph($workspaceName)
            ->getSubgraph(
                $dimensionSpacePoint,
                NeosVisibilityConstraints::excludeRemoved()
            );

        return new NodeService(
            contentRepository: $contentRepository,
            subgraph: $subgraph,
            nodeLabelGenerator: $this->nodeLabelGenerator,
        );
    }
}
