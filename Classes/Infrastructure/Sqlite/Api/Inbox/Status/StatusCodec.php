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

namespace Neos\Neos\Ui\Infrastructure\Sqlite\Api\Inbox\Status;

use Neos\Flow\Annotations as Flow;
use Neos\Neos\Ui\Framework\Api\Inbox\Status\Status;

#[Flow\Proxy(false)]
final class StatusCodec
{
    public static function encode(Status $status): string
    {
        return json_encode($status);
    }

    public static function decode(string $statusAsString): ?Status
    {
        throw new \Exception(__METHOD__ . ' is not implemented yet!');
    }
}
