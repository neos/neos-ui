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

namespace Neos\Neos\Ui\Application;

use Neos\Flow\Annotations as Flow;
use Neos\Flow\Security\Cryptography\HashService;
use Neos\Neos\Ui\Framework\Api\Api;
use Neos\Neos\Ui\Framework\Api\Inbox\Notification\Notification;
use Neos\Neos\Ui\Infrastructure\Neos\Neos\Api\Inbox\InboxAddressProvider;
use Neos\Neos\Ui\Infrastructure\Sqlite\Api\Inbox\InboxRepository;
use Neos\Neos\Ui\Infrastructure\Time\Clock;

#[Flow\Scope("singleton")]
final class UiApi
{
    #[Flow\Inject(lazy: false)]
    protected HashService $hashService;

    #[Flow\Inject(lazy: false)]
    protected UiApiManifest $manifest;

    #[Flow\Inject(lazy: false)]
    protected InboxAddressProvider $inboxAddressProvider;

    protected ?InboxRepository $inboxRepository = null;

    protected Api $api;

    public function initializeObject(): void
    {
        $this->api = new Api(
            inboxRepository: $this->inboxRepository = new InboxRepository(
                hashService: $this->hashService,
                inboxAddressProvider: $this->inboxAddressProvider,
                clock: new Clock(new \DateTimeImmutable()),
                notificationLogBufferSize: 1024
            ),
            inboxAddressProvider: $this->inboxAddressProvider,
            manifest: $this->manifest
        );
    }

    public function handleQuery(array $query): \JsonSerializable
    {
        return $this->api->handleQuery($query);
    }

    public function handleCommand(array $command): void
    {
        $this->api->handleCommand($command);
    }

    public function pollInboxOfCurrentUser(int $since): \JsonSerializable
    {
        return $this->api->pollInboxOfCurrentUser($since);
    }

    public function notifyEverybody(Notification $notification): void
    {
        $this->api->notifyEverybody($notification);
    }

    public function notifyCurrentUser(Notification $notification): void
    {
        $this->api->notifyCurrentUser($notification);
    }

    public function flush(): void
    {
        $this->inboxRepository?->persist();
    }
}
