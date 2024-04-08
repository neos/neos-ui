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

use Neos\ContentRepository\Core\Projection\ContentGraph\Node;
use Neos\Flow\Annotations as Flow;
use Neos\Flow\Mvc\ActionRequest;
use Neos\Neos\Ui\Fusion\Helper\NodeInfoHelper;

/**
 * @internal for communication within the Neos UI only
 */
#[Flow\Proxy(false)]
final class NodeMapBuilder
{
    /**
     * @var MinimalNodeForTree[]
     */
    private array $items;

    /**
     * @param class-string<MinimalNodeForTree> $nodeRepresentationClass
     */
    public function __construct(
        private readonly string $nodeRepresentationClass,
        private readonly NodeInfoHelper $nodeInfoHelper,
        private readonly ActionRequest $actionRequest
    ) {
    }

    public function addNode(Node $node): void
    {
        $this->items[] = $this->nodeRepresentationClass::fromNode(
            node: $node,
            nodeInfoHelper: $this->nodeInfoHelper,
            actionRequest: $this->actionRequest
        );
    }

    public function build(): NodeMap
    {
        return new NodeMap(...$this->items);
    }
}
