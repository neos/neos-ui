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

namespace Neos\Neos\Ui\Tests\Framework\Api\Fixtures;

use Neos\Neos\Ui\Framework\Api\Dto\Dto;

final class DtoWithNullablePrimitiveProperties extends Dto
{
    public function __construct(
        public readonly ?bool $boolean,
        public readonly ?int $integer,
        public readonly ?float $float,
        public readonly ?string $string
    ) {
    }
}
