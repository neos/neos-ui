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
use Neos\Neos\Ui\Framework\Api\Dto\Dto;
use Neos\Neos\Ui\Framework\Api\Inbox\Notification\Notifications;
use Neos\Neos\Ui\Framework\Api\Inbox\Status\Statuses;

#[Flow\Proxy(false)]
final class InboxDto extends Dto
{
    public function __construct(
        public readonly int $latest,
        public readonly Notifications $notifications,
        public readonly Statuses $statuses
    ) {
    }
}
