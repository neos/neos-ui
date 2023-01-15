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

namespace Neos\Neos\Ui\Framework\Api\Query;

use Neos\Flow\Annotations as Flow;
use Neos\Neos\Ui\Framework\Api\Dto\Dto;

#[Flow\Proxy(false)]
abstract class Query extends Dto
{
    public static function getQueryHandlerClassName(): string
    {
        return sprintf('%sHandler', static::class);
    }

    public static function getQueryResultClassName(): string
    {
        return sprintf('%sResult', static::class);
    }
}
