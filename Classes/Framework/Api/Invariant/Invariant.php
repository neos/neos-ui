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

namespace Neos\Neos\Ui\Framework\Api\Invariant;

use Neos\Flow\Annotations as Flow;

#[Flow\Proxy(false)]
abstract class Invariant extends \LogicException
{
    final private function __construct(
        private readonly bool $success,
        ?string $message = null,
        ?int $code = null,
        ?Invariant $cause = null
    ) {
        if (!$success) {
            assert($message !== null);
            assert($code !== null);

            parent::__construct($message, $code, $cause);
        }
    }

    final public static function succeed(): static
    {
        return new static(true);
    }

    final public static function fail(string $message, int $code, ?Invariant $cause = null): static
    {
        return new static(false, $message, $code, $cause);
    }

    final public function assert(): void
    {
        if (!$this->success) {
            throw $this;
        }
    }

    final public function verify(): bool
    {
        return $this->success;
    }
}
