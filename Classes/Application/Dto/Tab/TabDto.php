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

namespace Neos\Neos\Ui\Application\Dto\Tab;

use Neos\Flow\Annotations as Flow;
use Neos\Neos\Ui\Application\Dto\Group\GroupsDto;
use Neos\Neos\Ui\Framework\Api\Dto\Dto;

#[Flow\Proxy(false)]
final class TabDto extends Dto
{
    public function __construct(
        public readonly string $name,
        public readonly null|int|string $position,
        public readonly string $label,
        public readonly string $icon,
        public readonly GroupsDto $groups
    ) {
    }
}
