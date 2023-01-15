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

namespace Neos\Neos\Ui\Infrastructure\Sqlite\Api\Inbox\Status;

use Neos\Flow\Annotations as Flow;
use Neos\Neos\Ui\Framework\Api\Inbox\Status\Status;
use Neos\Neos\Ui\Framework\Api\Inbox\Status\StatusRepositoryInterface;
use Neos\Neos\Ui\Infrastructure\Sqlite\SQLite3Factory;

#[Flow\Proxy(false)]
final class StatusRepository implements StatusRepositoryInterface
{
    public function __construct(
        private readonly SQLite3Factory $sqlite3Factory,
    ) {
    }

    public function add(Status $notification): void
    {
        throw new \Exception(__METHOD__ . ' is not implemented yet!');
    }

    /**
     * @return \Traversable<Status>
     */
    public function findAll(): \Traversable
    {
        $database = $this->sqlite3Factory->getDatabase();
        if ($database) {
            $sql = <<<SQL
            SELECT
                *
            FROM
                statuses
            SQL;

            $statement = $database->prepare($sql);
            $result = $statement->execute();

            while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
                if (isset($row['serialized_status']) && is_string($row['serialized_status'])) {
                    if ($status = StatusCodec::decode($row['serialized_status'])) {
                        yield $status;
                    }
                }
            }
        }
    }

    public function persist(): void
    {
        $this->sqlite3Factory->createDatabaseIfNotExists();

        $database = $this->sqlite3Factory->getDatabase();
        if ($database) {
            $this->createNotificationsTableIfNotExists($database);
        }
    }

    private function createNotificationsTableIfNotExists(\SQLite3 $database): void
    {
        $sql = <<<SQL
        CREATE TABLE IF NOT EXISTS statuses (
            status_type TEXT,
            serialized_status TEXT
        );
        SQL;

        $database->exec($sql);
    }
}
