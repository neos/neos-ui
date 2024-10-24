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
 * @internal
 */
#[Flow\Proxy(false)]
final class ConflictsBuilder
{
    /**
     * @var Conflict[]
     */
    private array $items = [];

    /**
     * @var array<string,Conflict>
     */
    private array $itemsByKey = [];

    public function addConflict(Conflict $conflict): self
    {
        if (!isset($this->itemsByKey[$conflict->key])) {
            $this->itemsByKey[$conflict->key] = $conflict;
            $this->items[] = $conflict;
        }

        return $this;
    }

    public function build(): Conflicts
    {
        return new Conflicts(...$this->items);
    }
}
