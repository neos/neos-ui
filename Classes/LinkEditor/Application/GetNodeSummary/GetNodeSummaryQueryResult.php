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

namespace Neos\Neos\Ui\LinkEditor\Application\GetNodeSummary;

use Neos\Flow\Annotations as Flow;
use Psr\Http\Message\UriInterface;

/**
 * @internal
 */
#[Flow\Proxy(false)]
final class GetNodeSummaryQueryResult implements \JsonSerializable
{
    public function __construct(
        public readonly string $icon,
        public readonly string $label,
        public readonly UriInterface $uri,
        public readonly Breadcrumbs $breadcrumbs,
    ) {
    }

    public function jsonSerialize(): mixed
    {
        $result = get_object_vars($this);
        $result['uri'] = (string) $result['uri'];

        return $result;
    }
}
