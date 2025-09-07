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

namespace Neos\Neos\Ui\LinkEditor\Application\Shared;

use Neos\ContentRepository\Core\Projection\ContentGraph\ContentSubgraphInterface;
use Neos\ContentRepository\Core\SharedModel\Node\NodeAggregateId;
use Neos\Flow\Annotations as Flow;

/**
 * @internal
 */
#[Flow\Proxy(false)]
final class NodeWasNotFound extends \Exception
{
    private function __construct(string $message, int $code)
    {
        parent::__construct($message, $code);
    }

    public static function becauseNodeWithGivenIdentifierDoesNotExistInCurrentSubgraph(
        NodeAggregateId $nodeAggregateId,
        ContentSubgraphInterface $subgraph,
    ): self {
        return new self(
            sprintf(
                'A node with the identifier "%s" does not exist in subgraph: %s',
                $nodeAggregateId->value,
                json_encode([
                    'contentRepositoryId' => $subgraph->getContentRepositoryId(),
                    'workspaceName' => $subgraph->getWorkspaceName(),
                    'dimensionSpacePoint' => $subgraph->getDimensionSpacePoint(),
                ], JSON_PRETTY_PRINT),
            ),
            1715082627
        );
    }
}
