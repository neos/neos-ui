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
use Neos\Neos\Ui\Framework\Api\Inbox\Notification\Notification;
use Neos\Neos\Ui\Framework\Api\Inbox\Notification\NotificationRepositoryInterface;
use Neos\Neos\Ui\Framework\Api\Inbox\Notification\Notifications;
use Neos\Neos\Ui\Framework\Api\Inbox\Status\Status;
use Neos\Neos\Ui\Framework\Api\Inbox\Status\Statuses;
use Neos\Neos\Ui\Framework\Api\Inbox\Status\StatusRepositoryInterface;

#[Flow\Proxy(false)]
final class Inbox
{
    public function __construct(
        private readonly InboxAddress $address,
        private readonly NotificationRepositoryInterface $notificationRepository,
        private readonly StatusRepositoryInterface $statusRepository,
    ) {
    }

    public function getAddress(): InboxAddress
    {
        return $this->address;
    }

    public function getLatest(): ?\DateTimeInterface
    {
        return $this->notificationRepository->getLatest();
    }

    public function receiveNotification(Notification $notification): void
    {
        $this->notificationRepository->add($notification);
    }

    public function updateStatus(Status $status)
    {
        $this->statusRepository->add($status);
    }

    public function getRecentNotifications(\DateTimeInterface $since): Notifications
    {
        return Notifications::fromTraversable(
            $this->notificationRepository->findAllSince($since)
        );
    }

    public function getCurrentStatuses(): Statuses
    {
        return Statuses::fromTraversable(
            $this->statusRepository->findAll()
        );
    }
}
