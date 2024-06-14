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

use Neos\Flow\Annotations as Flow;
use Neos\Neos\FrontendRouting\NodeAddress;

/**
 * The application layer level query result containing all nodes the UI needs
 * to refresh its in-memory node cache
 *
 * @internal for communication within the Neos UI only
 */
#[Flow\Proxy(false)]
final readonly class ReloadNodesQueryResult implements \JsonSerializable
{
    public function __construct(
        public NodeAddress $documentId,
        public NodeMap $nodes
    ) {
    }

    /**
     * @return array{documentId:string,nodes:NodeMap}
     */
    public function jsonSerialize(): array
    {
        return [
            'documentId' => $this->documentId->serializeForUri(),
            'nodes' => $this->nodes
        ];
    }
}
