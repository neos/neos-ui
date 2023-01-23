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

use Neos\Utility\Files;

final class PathConventions
{
    private static string $pathToInboxDirectory;

    public static function getPathToInboxDirectory(): string
    {
        return self::$pathToInboxDirectory ??= Files::concatenatePaths([
            FLOW_PATH_DATA,
            'Persistent/Neos.Ui/Inboxes'
        ]);
    }
}
