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

namespace Neos\Neos\Ui\Infrastructure\Sqlite\Api\Inbox\Notification;

use Neos\Flow\Annotations as Flow;
use Neos\Neos\Ui\Framework\Api\Inbox\Notification\Notification;

#[Flow\Proxy(false)]
final class NotificationCodec
{
    public static function encode(Notification $notification): string
    {
        return json_encode($notification);
    }

    public static function decode(string $notificationAsString): ?Notification
    {
        $notificationAsArray = @json_decode($notificationAsString, true);
        if ($notificationAsArray) {
            try {
                // @TODO: Needs to be formalized
                return $notificationAsArray['__type']::fromArray($notificationAsArray);
            } catch (\Throwable $__) {
            }
        }

        return null;
    }
}
