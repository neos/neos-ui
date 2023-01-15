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

namespace Neos\Neos\Ui\Framework\Api\Inbox\Notification;

use Neos\Flow\Annotations as Flow;
use Neos\Neos\Ui\Framework\Api\ListDto\ListDto;

#[Flow\Proxy(false)]
final class Notifications extends ListDto
{
    public function __construct(Notification ...$items)
    {
        parent::__construct($items);
    }

    /**
     * @param \Traversable<Notification> $notifications
     * @return self
     */
    public static function fromTraversable(\Traversable $notifications): self
    {
        return new self(...\iterator_to_array($notifications));
    }
}
