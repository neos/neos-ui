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

namespace Neos\Neos\Ui\Framework\Api\Inbox;

use Neos\Flow\Annotations as Flow;

#[Flow\Proxy(false)]
final class InboxAddress implements \Stringable
{
    public function __construct(
        private readonly string $value
    ) {
    }

    public static function from(string $string): self
    {
        return new self($string);
    }

    public function __toString(): string
    {
        return $this->value;
    }
}
