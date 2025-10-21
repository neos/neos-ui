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

namespace Neos\Neos\Ui\ReferencesEditor\Application\GetReferencesSummary;

use GuzzleHttp\Psr7\Uri;
use Neos\ContentRepository\Core\Projection\ContentGraph\Filter\FindReferencesFilter;
use Neos\ContentRepository\Core\Projection\ContentGraph\Node;
use Neos\ContentRepository\Core\SharedModel\Node\NodeAggregateId;
use Neos\ContentRepositoryRegistry\ContentRepositoryRegistry;
use Neos\Flow\Annotations as Flow;
use Neos\Neos\Domain\SubtreeTagging\NeosVisibilityConstraints;
use Neos\Neos\Ui\LinkEditor\Infrastructure\ESCR\NodeService;
use Neos\Neos\Ui\LinkEditor\Infrastructure\ESCR\NodeServiceFactory;

/**
 * @internal
 */
#[Flow\Scope("singleton")]
final class GetReferencesSummaryQueryHandler
{
    #[Flow\Inject]
    protected NodeServiceFactory $nodeServiceFactory;

    #[Flow\Inject]
    protected ContentRepositoryRegistry $contentRepositoryRegistry;

    public function handle(GetReferencesSummaryQuery $query): array
    {
        $nodeService = $this->nodeServiceFactory->create(
            contentRepositoryId: $query->contentRepositoryId,
            workspaceName: $query->workspaceName,
            dimensionSpacePoint: $query->dimensionSpacePoint,
        );

        $contentRepository = $this->contentRepositoryRegistry->get($query->contentRepositoryId);
        $subgraph = $contentRepository->getContentGraph($query->workspaceName)->getSubgraph($query->dimensionSpacePoint, NeosVisibilityConstraints::excludeRemoved());
        $references = $subgraph->findReferences($query->nodeId, FindReferencesFilter::create(referenceName: $query->referenceName));

        $referencesSummary = [];
        foreach ($references as $reference) {
            $referencesNode = $reference->node;
            $referenceNodeType = $nodeService->requireNodeTypeByName($referencesNode->nodeTypeName);

            $referencesSummary[] = new GetReferencesSummaryQueryResult(
                icon: $referenceNodeType->getConfiguration('ui.icon') ?? 'questionmark',
                label: $nodeService->getLabelForNode($referencesNode),
                uri: new Uri('node://' . $referencesNode->aggregateId->value),
                breadcrumbs: $this->createBreadcrumbsForNode($nodeService, $referencesNode),
                hasProperties: false,
                properties: $reference->properties
            );
        }

        return ["references" => $referencesSummary];
    }

    private function createBreadcrumbsForNode(NodeService $nodeService, Node $node): Breadcrumbs
    {
        $items = [];

        while ($node) {
            /** @var Node $node */
            $items[] = $this->createBreadcrumbForNode($nodeService, $node);
            $node = $nodeService->findParentNode($node);
        }

        $items = array_slice($items, 0, -1);
        $items = array_reverse($items);

        return new Breadcrumbs(...$items);
    }

    private function createBreadcrumbForNode(NodeService $nodeService, Node $node): Breadcrumb
    {
        $nodeType = $nodeService->requireNodeTypeByName($node->nodeTypeName);

        return new Breadcrumb(
            icon: $nodeType->getConfiguration('ui.icon') ?? 'questionmark',
            label: $nodeService->getLabelForNode($node),
        );
    }
}
