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
use Neos\Neos\Ui\Framework\Api\Inbox\Notification\NotificationRepositoryInterface;
use Neos\Neos\Ui\Infrastructure\Sqlite\SQLite3Factory;
use Neos\Neos\Ui\Infrastructure\Time\ClockInterface;

#[Flow\Proxy(false)]
final class NotificationRepository implements NotificationRepositoryInterface
{
    /**
     * @var Notification[]
     */
    private array $queue = [];

    public function __construct(
        private readonly SQLite3Factory $sqlite3Factory,
        private readonly ClockInterface $clock,
        private readonly int $bufferSize
    ) {
    }

    public function add(Notification $notification): void
    {
        $this->queue[] = $notification;
    }

    /**
     * @param \DateTimeInterface $since
     * @return \Traversable<Notification>
     */
    public function findAllSince(\DateTimeInterface $since): \Traversable
    {
        $database = $this->sqlite3Factory->getDatabase();
        if ($database) {
            $sql = <<<SQL
            SELECT
                *
            FROM
                notifications
            WHERE
                occurred_at > :since
            ORDER BY
                occurred_at ASC
            SQL;

            $statement = $database->prepare($sql);
            $statement->bindValue(':since', $since->getTimestamp());

            $result = $statement->execute();

            while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
                if (isset($row['serialized_notification']) && is_string($row['serialized_notification'])) {
                    if ($notification = NotificationCodec::decode($row['serialized_notification'])) {
                        yield $notification;
                    }
                }
            }
        }
    }

    public function getLatest(): ?\DateTimeInterface
    {
        $database = $this->sqlite3Factory->getDatabase();
        if ($database) {
            $sql = <<<SQL
            SELECT
                occurred_at
            FROM
                notifications
            ORDER BY
                occurred_at DESC
            LIMIT 1
            SQL;

            $statement = $database->prepare($sql);

            $result = $statement->execute();

            if ($row = $result->fetchArray(SQLITE3_ASSOC)) {
                if (isset($row['occurred_at']) && is_int($row['occurred_at'])) {
                    return (new \DateTimeImmutable())->setTimestamp($row['occurred_at']);
                }
            }
        }

        return null;
    }

    public function persist(): void
    {
        $this->sqlite3Factory->createDatabaseIfNotExists();

        $database = $this->sqlite3Factory->getDatabase();
        if ($database) {
            $this->createNotificationsTableIfNotExists($database);
            $this->flushNotificationsQueueIntoDatabase($database);
            $this->truncateNotificationLogToBufferSize($database);
        }
    }

    private function createNotificationsTableIfNotExists(\SQLite3 $database): void
    {
        $sql = <<<SQL
        CREATE TABLE IF NOT EXISTS notifications (
            occurred_at INTEGER,
            serialized_notification TEXT
        );
        SQL;

        $database->exec($sql);
    }

    private function flushNotificationsQueueIntoDatabase(\SQLite3 $database): void
    {
        $sql = <<<SQL
        INSERT INTO notifications VALUES (
            :occurred_at,
            :serialized_notification
        );
        SQL;

        $statement = $database->prepare($sql);
        $statement->bindValue(
            ':occurred_at',
            $this->clock->now()->getTimestamp(),
            \SQLITE3_INTEGER
        );

        foreach ($this->queue as $notification) {
            $statement->bindValue(
                ':serialized_notification',
                NotificationCodec::encode($notification),
                \SQLITE3_TEXT
            );
            $statement->execute();
        }

        $this->queue = [];
    }

    private function truncateNotificationLogToBufferSize(\SQLite3 $database): void
    {
        $sql = <<<SQL
        DELETE FROM notifications WHERE occurred_at <= (
            SELECT occurred_at FROM (
                SELECT occurred_at
                FROM notifications
                ORDER BY occurred_at DESC
                LIMIT 1 OFFSET :buffer_size
            )
        );
        SQL;

        $statement = $database->prepare($sql);
        $statement->bindValue(':buffer_size', $this->bufferSize, \SQLITE3_INTEGER);
        $statement->execute();
    }
}
