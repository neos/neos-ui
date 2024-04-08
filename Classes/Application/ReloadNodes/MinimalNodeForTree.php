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
 * A helper DTO containing a minimal node representation as needed for
 * the document or content tree
 *
 * @internal for communication within the Neos UI only
 */
#[Flow\Proxy(false)]
final readonly class MinimalNodeForTree implements \JsonSerializable
{
    /**
     * @param array{nodeAddress:string}&array<string,mixed> $data
     */
    private function __construct(private array $data)
    {
    }

    public static function fromNode(
        Node $node,
        NodeInfoHelper $nodeInfoHelper,
        ActionRequest $actionRequest
    ): ?self {
        /** @var null|(array{nodeAddress:string}&array<string,mixed>) $data */
        $data = $nodeInfoHelper
            ->renderNodeWithMinimalPropertiesAndChildrenInformation(
                node: $node,
                actionRequest: $actionRequest
            );

        return $data ? new self($data) : null;
    }

    public function getNodeAddressAsString(): string
    {
        return $this->data['nodeAddress'];
    }

    /**
     * @return array<string,mixed>
     */
    public function jsonSerialize(): array
    {
        return $this->data;
    }
}
