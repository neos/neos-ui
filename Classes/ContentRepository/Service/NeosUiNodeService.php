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


use Neos\ContentRepository\Core\Projection\ContentGraph\Node;
use Neos\ContentRepository\Core\Projection\ContentGraph\VisibilityConstraints;
use Neos\ContentRepository\Core\SharedModel\Node\NodeAddress;
use Neos\ContentRepositoryRegistry\ContentRepositoryRegistry;
use Neos\Flow\Annotations as Flow;

/**
 * @internal
 * @Flow\Scope("singleton")
 */
class NeosUiNodeService
{
    #[Flow\Inject]
    protected ContentRepositoryRegistry $contentRepositoryRegistry;

    public function findNodeBySerializedNodeAddress(string $serializedNodeAddress): ?Node
    {
        $nodeAddress = NodeAddress::fromJsonString($serializedNodeAddress);
        $contentRepository = $this->contentRepositoryRegistry->get($nodeAddress->contentRepositoryId);

        $subgraph = $contentRepository->getContentGraph($nodeAddress->workspaceName)->getSubgraph(
            $nodeAddress->dimensionSpacePoint,
            VisibilityConstraints::withoutRestrictions()
        );
        return $subgraph->findNodeById($nodeAddress->aggregateId);
    }
}
