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

interface NotificationRepositoryInterface
{
    public function add(Notification $notification): void;

    /**
     * @param \DateTimeInterface $since
     * @return \Traversable<Notification>
     */
    public function findAllSince(\DateTimeInterface $since): \Traversable;

    public function getLatest(): ?\DateTimeInterface;
}
