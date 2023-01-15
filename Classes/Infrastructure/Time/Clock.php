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

namespace Neos\Neos\Ui\Infrastructure\Time;

use Neos\Flow\Annotations as Flow;

#[Flow\Proxy(false)]
final class Clock implements ClockInterface
{
    public function __construct(private readonly \DateTimeInterface $now)
    {
    }

    public function now(): \DateTimeInterface
    {
        return $this->now;
    }
}
