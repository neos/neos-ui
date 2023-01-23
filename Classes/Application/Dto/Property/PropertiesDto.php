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

namespace Neos\Neos\Ui\Application\Dto\Property;

use Neos\Flow\Annotations as Flow;
use Neos\Neos\Ui\Framework\Api\ListDto\ListDto;

/**
 * @extends ListDto<PropertyDto>
 */
#[Flow\Proxy(false)]
final class PropertiesDto extends ListDto
{
    public function __construct(PropertyDto ...$items)
    {
        parent::__construct(array_values($items));
    }
}
