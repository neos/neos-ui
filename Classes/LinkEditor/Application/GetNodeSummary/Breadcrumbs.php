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

/**
 * @internal
 */
#[Flow\Proxy(false)]
final class Breadcrumbs implements \JsonSerializable
{
    /** @var Breadcrumb[] */
    private readonly array $items;

    public function __construct(Breadcrumb ...$items)
    {
        $this->items = array_values($items);
    }

    public function jsonSerialize(): mixed
    {
        return $this->items;
    }
}
