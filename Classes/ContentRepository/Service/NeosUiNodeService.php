<?php
namespace Neos\Neos\Ui\ContentRepository\Service;

/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */


use Neos\ContentRepository\Core\Factory\ContentRepositoryId;
use Neos\ContentRepository\Core\Projection\ContentGraph\Node;
use Neos\Neos\FrontendRouting\NodeAddressFactory;
use Neos\ContentRepository\Core\Projection\ContentGraph\VisibilityConstraints;
use Neos\ContentRepositoryRegistry\ContentRepositoryRegistry;
use Neos\Flow\Annotations as Flow;
use Neos\Neos\Utility\NodeTypeWithFallbackProvider;

/**
 * @internal
 * @Flow\Scope("singleton")
 */
class NeosUiNodeService
{
    use NodeTypeWithFallbackProvider;

    #[Flow\Inject]
    protected ContentRepositoryRegistry $contentRepositoryRegistry;

    public function findNodeBySerializedNodeAddress(string $serializedNodeAddress, ContentRepositoryId $contentRepositoryId): ?Node
    {
        $contentRepository = $this->contentRepositoryRegistry->get($contentRepositoryId);
        $nodeAddress = NodeAddressFactory::create($contentRepository)->createFromUriString($serializedNodeAddress);

        $subgraph = $contentRepository->getContentGraph()->getSubgraph(
            $nodeAddress->contentStreamId,
            $nodeAddress->dimensionSpacePoint,
            VisibilityConstraints::withoutRestrictions()
        );
        return $subgraph->findNodeById($nodeAddress->nodeAggregateId);
    }
}
