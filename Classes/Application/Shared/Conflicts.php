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

namespace Neos\Neos\Ui\Application\Shared;

use Neos\Flow\Annotations as Flow;

/**
 * @internal for communication within the Neos UI only
 */
#[Flow\Proxy(false)]
final readonly class Conflicts implements \JsonSerializable, \Countable
{
    /** @var Conflict[] */
    private array $items;

    public function __construct(Conflict ...$items)
    {
        $this->items = $items;
    }

    public static function builder(): ConflictsBuilder
    {
        return new ConflictsBuilder();
    }

    public function jsonSerialize(): mixed
    {
        return $this->items;
    }

    public function count(): int
    {
        return count($this->items);
    }
}
