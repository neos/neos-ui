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

namespace Neos\Neos\Ui\Infrastructure\Sqlite\Api\Inbox;

use Neos\Flow\Annotations as Flow;
use Neos\Flow\Security\Cryptography\HashService;
use Neos\Neos\Ui\Framework\Api\Inbox\Inbox;
use Neos\Neos\Ui\Framework\Api\Inbox\InboxAddress;
use Neos\Neos\Ui\Framework\Api\Inbox\InboxAddressProviderInterface;
use Neos\Neos\Ui\Framework\Api\Inbox\InboxRepositoryInterface;
use Neos\Neos\Ui\Infrastructure\Sqlite\Api\Inbox\Notification\NotificationRepository;
use Neos\Neos\Ui\Infrastructure\Sqlite\Api\Inbox\Status\StatusRepository;
use Neos\Neos\Ui\Infrastructure\Sqlite\SQLite3Factory;
use Neos\Neos\Ui\Infrastructure\Time\ClockInterface;
use Neos\Utility\Files;

#[Flow\Proxy(false)]
final class InboxRepository implements InboxRepositoryInterface
{
    /**
     * @var array<string,SQLite3Factory>
     */
    private array $sqlite3FactoriesByAddress = [];

    /**
     * @var array<string,Inbox>
     */
    private array $inboxesByAddress = [];

    /**
     * @var array<string,NotificationRepository>
     */
    private array $notificationRepositoriesByAddress = [];

    /**
     * @var array<string,StatusRepository>
     */
    private array $statusRepositoriesByAddress = [];

    public function __construct(
        private readonly HashService $hashService,
        private readonly InboxAddressProviderInterface $inboxAddressProvider,
        private readonly ClockInterface $clock,
        private readonly int $notificationLogBufferSize
    ) {
    }

    public function findOneByAddress(InboxAddress $address): ?Inbox
    {
        return $this->inboxesByAddress[(string) $address] ??= new Inbox(
            address: $address,
            notificationRepository: $this->getNotificationRepositoryForInboxAddress($address),
            statusRepository: $this->getStatusRepositoryForInboxAddress($address)
        );
    }

    /**
     * @return \Traversable<Inbox>
     */
    public function findAll(): \Traversable
    {
        foreach ($this->inboxAddressProvider->getAllAvailableInboxAddresses() as $address) {
            if ($inbox = $this->findOneByAddress($address)) {
                yield $inbox;
            }
        }
    }

    public function persist(): void
    {
        foreach ($this->notificationRepositoriesByAddress as $notificationRepository) {
            $notificationRepository->persist();
        }

        foreach ($this->statusRepositoriesByAddress as $statusRepository) {
            $statusRepository->persist();
        }
    }

    private function getPathToInbox(InboxAddress $address): string
    {
        return Files::concatenatePaths([
            PathConventions::getPathToInboxDirectory(),
            $this->hashService->generateHmac((string) $address)
        ]);
    }

    private function getSqlite3FactoryForInboxAddress(InboxAddress $address): SQLite3Factory
    {
        return $this->sqlite3FactoriesByAddress[(string) $address] ??=
            new SQLite3Factory($this->getPathToInbox($address));
    }

    private function getNotificationRepositoryForInboxAddress(
        InboxAddress $address
    ): NotificationRepository {
        return $this->notificationRepositoriesByAddress[(string) $address] ??=
            new NotificationRepository(
                sqlite3Factory: $this->getSqlite3FactoryForInboxAddress($address),
                clock: $this->clock,
                bufferSize: $this->notificationLogBufferSize
            );
    }

    private function getStatusRepositoryForInboxAddress(
        InboxAddress $address
    ): StatusRepository {
        return $this->statusRepositoriesByAddress[(string) $address] ??=
            new StatusRepository(
                sqlite3Factory: $this->getSqlite3FactoryForInboxAddress($address),
            );
    }
}
