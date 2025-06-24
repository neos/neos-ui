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

namespace Neos\Neos\Ui\Infrastructure\ESCR;

use Neos\ContentRepository\Core\DimensionSpace\DimensionSpacePoint;
use Neos\ContentRepository\Core\SharedModel\Node\NodeAggregateId;
use Neos\Flow\Annotations as Flow;
use Neos\Neos\PendingChangesProjection\Changes;

#[Flow\Proxy(false)]
final readonly class NodeChangeStateCollection
{
    /**
     * @param array<string, NodeChangeState> $changesByNodeAggregateId
     */
    private function __construct(
        private array $changesByNodeAggregateId,
    ) {
    }

    public static function create(Changes $changes, DimensionSpacePoint $dimensionSpacePoint): self
    {
        /**
         * @var array<string, NodeChangeState> $changesByNodeAggregateId
         */
        $changesByNodeAggregateId = [];

        foreach ($changes as $change) {
            if ($change->originDimensionSpacePoint === null || $change->originDimensionSpacePoint->equals($dimensionSpacePoint)) {
                if ($pendingChange = $changesByNodeAggregateId[$change->nodeAggregateId->value] ?? null) {
                    $changesByNodeAggregateId[$change->nodeAggregateId->value] = $pendingChange->withAppliedAdditionalChange($change);
                } else {
                    $changesByNodeAggregateId[$change->nodeAggregateId->value] = NodeChangeState::fromChange($change);
                }
            }
        }
        return new self(
            $changesByNodeAggregateId
        );
    }

    public function findByNodeAggreqateId(NodeAggregateId $nodeAggregateId): ?NodeChangeState
    {
        return $this->changesByNodeAggregateId[$nodeAggregateId->value] ?? null;
    }
}
