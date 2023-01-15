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

namespace Neos\Neos\Ui\Application\Notification;

use Neos\Flow\Annotations as Flow;
use Neos\Neos\Ui\Application\Dto\Property\PropertiesDto;
use Neos\Neos\Ui\Framework\Api\Inbox\Notification\Notification;

#[Flow\Proxy(false)]
final class PropertiesWereUpdatedNotification extends Notification
{
    public function __construct(
        public readonly string $nodeContextPath,
        public readonly bool $reloadRequired,
        public readonly PropertiesDto $properties
    ) {
    }
}
