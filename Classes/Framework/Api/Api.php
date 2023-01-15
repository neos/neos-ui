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

namespace Neos\Neos\Ui\Framework\Api;

use Neos\Flow\Annotations as Flow;
use Neos\Neos\Ui\Framework\Api\Command\CannotHandleCommandException;
use Neos\Neos\Ui\Framework\Api\Inbox\InboxAddressProviderInterface;
use Neos\Neos\Ui\Framework\Api\Inbox\InboxDto;
use Neos\Neos\Ui\Framework\Api\Inbox\InboxRepositoryInterface;
use Neos\Neos\Ui\Framework\Api\Inbox\Notification\CannotNotifyCurrentUserException;
use Neos\Neos\Ui\Framework\Api\Inbox\Notification\CannotNotifyEverybodyException;
use Neos\Neos\Ui\Framework\Api\Inbox\Notification\Notification;
use Neos\Neos\Ui\Framework\Api\Inbox\Notification\Notifications;
use Neos\Neos\Ui\Framework\Api\Inbox\Status\CannotUpdateStatusForCurrentUserException;
use Neos\Neos\Ui\Framework\Api\Inbox\Status\CannotUpdateStatusForEverybodyException;
use Neos\Neos\Ui\Framework\Api\Inbox\Status\Status;
use Neos\Neos\Ui\Framework\Api\Inbox\Status\Statuses;
use Neos\Neos\Ui\Framework\Api\Manifest\ManifestInterface;
use Neos\Neos\Ui\Framework\Api\Query\CannotHandleQueryException;
use Neos\Neos\Ui\Framework\Api\Query\QueryResult;

#[Flow\Proxy(false)]
final class Api
{
    public function __construct(
        private readonly InboxRepositoryInterface $inboxRepository,
        private readonly InboxAddressProviderInterface $inboxAddressProvider,
        private readonly ManifestInterface $manifest
    ) {
    }

    public function handleQuery(array $query): QueryResult
    {
        if (!isset($query['__type'])) {
            throw CannotHandleQueryException::becauseNoQueryClassNameWasSpecified(
                static::class
            );
        }

        $queryClassName = $query['__type'];
        if (!$this->manifest->isKnownQueryClassName($queryClassName)) {
            throw CannotHandleQueryException::becauseQueryClassNameIsUnknown(
                static::class,
                $queryClassName
            );
        }

        try {
            $query = $queryClassName::fromArray($query);
        } catch (\Throwable $e) {
            throw CannotHandleQueryException::becauseQueryCouldNotBeDeserialized(
                static::class,
                $queryClassName,
                $e
            );
        }

        $queryHandlerClassName = $query::getQueryHandlerClassName();
        if (!class_exists($queryHandlerClassName)) {
            throw CannotHandleQueryException::becauseQueryHandlerDoesNotExist(
                static::class,
                $queryClassName,
                $queryHandlerClassName
            );
        }

        try {
            $queryHandler = new $queryHandlerClassName;
        } catch (\Throwable $e) {
            throw CannotHandleQueryException::becauseQueryHandlerCouldNotBeInstantiated(
                static::class,
                $queryHandlerClassName,
                $e
            );
        }

        return $queryHandler->handle($query);
    }

    public function handleCommand(array $command): void
    {
        if (!isset($command['__type'])) {
            throw CannotHandleCommandException::becauseNoCommandClassNameWasSpecified(
                static::class
            );
        }

        $commandClassName = $command['__type'];
        if (!$this->manifest->isKnownCommandClassName($commandClassName)) {
            throw CannotHandleCommandException::becauseCommandClassNameIsUnknown(
                static::class,
                $commandClassName
            );
        }

        try {
            $command = $commandClassName::fromArray($command);
        } catch (\Throwable $e) {
            throw CannotHandleCommandException::becauseCommandCouldNotBeDeserialized(
                static::class,
                $commandClassName,
                $e
            );
        }

        $commandHandlerClassName = $command::getCommandHandlerClassName();
        if (!class_exists($commandHandlerClassName)) {
            throw CannotHandleCommandException::becauseCommandHandlerDoesNotExist(
                static::class,
                $commandClassName,
                $commandHandlerClassName
            );
        }

        try {
            $commandHandler = new $commandHandlerClassName;
        } catch (\Throwable $e) {
            throw CannotHandleCommandException::becauseCommandHandlerCouldNotBeInstantiated(
                static::class,
                $commandHandlerClassName,
                $e
            );
        }

        $commandHandler->handle($command);
    }

    public function pollInboxOfCurrentUser(int $since): InboxDto
    {
        $address = $this->inboxAddressProvider->getInboxAddressOfCurrentUser();
        $inbox = $this->inboxRepository->findOneByAddress($address);
        if ($inbox) {
            $since = (new \DateTimeImmutable())->setTimestamp($since);

            return new InboxDto(
                latest: $inbox->getLatest()?->getTimestamp() ?? $since->getTimestamp(),
                notifications: $inbox->getRecentNotifications($since),
                statuses: $inbox->getCurrentStatuses()
            );
        }

        return new InboxDto(
            latest: $since,
            notifications: new Notifications(),
            statuses: new Statuses()
        );
    }

    public function notifyEverybody(Notification $notification): void
    {
        if (!$this->manifest->isKnownNotificationClassName($notification::class)) {
            throw CannotNotifyEverybodyException::becauseNotificationClassNameIsUnknown(
                static::class,
                $notification::class
            );
        }

        foreach ($this->inboxRepository->findAll() as $inbox) {
            $inbox->receiveNotification($notification);
        }
    }

    public function notifyCurrentUser(Notification $notification): void
    {
        if (!$this->manifest->isKnownNotificationClassName($notification::class)) {
            throw CannotNotifyCurrentUserException::becauseNotificationClassNameIsUnknown(
                static::class,
                $notification::class
            );
        }

        $address = $this->inboxAddressProvider->getInboxAddressOfCurrentUser();
        $inbox = $this->inboxRepository->findOneByAddress($address);

        if ($inbox !== null) {
            $inbox->receiveNotification($notification);
        }
    }

    public function updateStatusForEverybody(Status $status): void
    {
        if (!$this->manifest->isKnownStatusClassName($status::class)) {
            throw CannotUpdateStatusForEverybodyException::becauseStatusClassNameIsUnknown(
                static::class,
                $status::class
            );
        }

        foreach ($this->inboxRepository->findAll() as $inbox) {
            $inbox->updateStatus($status);
        }
    }

    public function updateStatusForCurrentUser(Status $status): void
    {
        if (!$this->manifest->isKnownStatusClassName($status::class)) {
            throw CannotUpdateStatusForCurrentUserException::becauseStatusClassNameIsUnknown(
                static::class,
                $status::class
            );
        }

        $address = $this->inboxAddressProvider->getInboxAddressOfCurrentUser();
        $inbox = $this->inboxRepository->findOneByAddress($address);

        if ($inbox !== null) {
            $inbox->updateStatus($status);
        }
    }
}
