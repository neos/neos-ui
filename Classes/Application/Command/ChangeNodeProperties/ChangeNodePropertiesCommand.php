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

namespace Neos\Neos\Ui\Application\Command\ChangeNodeProperties;

use Neos\Flow\Annotations as Flow;
use Neos\Neos\Ui\Application\Dto\Property\PropertiesDto;
use Neos\Neos\Ui\Framework\Api\Command\Command;

#[Flow\Proxy(false)]
final class ChangeNodePropertiesCommand extends Command
{
    public function __construct(
        public readonly string $nodeContextPath,
        public readonly PropertiesDto $properties
    ) {
    }
}
