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

namespace Neos\Neos\Ui\Infrastructure\Sqlite;

use Neos\Flow\Annotations as Flow;
use Neos\Utility\Files;

#[Flow\Proxy(false)]
final class SQLite3Factory
{
    private ?\SQLite3 $database = null;

    public function __construct(private readonly string $pathToDatabaseFile)
    {
        if (file_exists($this->pathToDatabaseFile)) {
            try {
                $this->database = new \SQLite3($this->pathToDatabaseFile);
            } catch (\Throwable $__) {
            }
        }
    }

    public function createDatabaseIfNotExists(): void
    {
        if (!file_exists($this->pathToDatabaseFile)) {
            Files::createDirectoryRecursively(dirname($this->pathToDatabaseFile));
        }

        try {
            $this->database = new \SQLite3($this->pathToDatabaseFile);
        } catch (\Throwable $__) {
        }
    }

    public function getDatabase(): ?\SQLite3
    {
        return $this->database;
    }
}
