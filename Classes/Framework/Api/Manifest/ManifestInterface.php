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

namespace Neos\Neos\Ui\Framework\Api\Manifest;

use Neos\Neos\Ui\Framework\Api\Command\Command;
use Neos\Neos\Ui\Framework\Api\Inbox\Notification\Notification;
use Neos\Neos\Ui\Framework\Api\Inbox\Status\Status;
use Neos\Neos\Ui\Framework\Api\Query\Query;

interface ManifestInterface
{
    public function getRootNamespace(): string;

    /**
     * @param class-string<Command> $commandClassName
     * @return boolean
     */
    public function isKnownCommandClassName(string $commandClassName): bool;

    /**
     * @param class-string<Query> $queryClassName
     * @return boolean
     */
    public function isKnownQueryClassName(string $queryClassName): bool;

    /**
     * @param class-string<Notification> $notificationClassName
     * @return boolean
     */
    public function isKnownNotificationClassName(string $notificationClassName): bool;

    /**
     * @param class-string<Status> $statusClassName
     * @return boolean
     */
    public function isKnownStatusClassName(string $statusClassName): bool;

    /**
     * @return class-string<Command>[]
     */
    public function getKnownCommandClassNames(): array;

    /**
     * @return class-string<Query>[]
     */
    public function getKnownQueryClassNames(): array;

    /**
     * @return class-string<Notification>[]
     */
    public function getKnownNotificationClassNames(): array;

    /**
     * @return class-string<Status>[]
     */
    public function getKnownStatusClassNames(): array;
}
