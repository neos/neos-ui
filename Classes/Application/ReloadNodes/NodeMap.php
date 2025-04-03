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
use Neos\Flow\Mvc\ActionRequest;
use Neos\Neos\Ui\Fusion\Helper\NodeInfoHelper;

/**
 * Helper DTO for collections of nodes
 *
 * @internal for communication within the Neos UI only
 */
#[Flow\Proxy(false)]
final readonly class NodeMap implements \JsonSerializable
{
    /** @var MinimalNodeForTree[] */
    private array $items;

    public function __construct(MinimalNodeForTree ...$items)
    {
        $this->items = $items;
    }

    /**
     * @param class-string<MinimalNodeForTree> $nodeRepresentationClass
     */
    public static function builder(
        string $nodeRepresentationClass,
        NodeInfoHelper $nodeInfoHelper,
        ActionRequest $actionRequest
    ): NodeMapBuilder {
        return new NodeMapBuilder(
            nodeRepresentationClass: $nodeRepresentationClass,
            nodeInfoHelper: $nodeInfoHelper,
            actionRequest: $actionRequest,
        );
    }

    /**
     * @return \stdClass|(array<string,MinimalNodeForTree>)
     */
    public function jsonSerialize(): mixed
    {
        $result = [];
        foreach ($this->items as $item) {
            $result[$item->getNodeAddressAsString()] = $item;
        }

        return $result ? $result : new \stdClass;
    }
}
