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

namespace Neos\Neos\Ui\Infrastructure\Neos\Flow\Api\Manifest;

use Neos\Flow\Annotations as Flow;
use Neos\Flow\Reflection\ReflectionService;
use Neos\Neos\Ui\Framework\Api\Command\Command;
use Neos\Neos\Ui\Framework\Api\Inbox\Notification\Notification;
use Neos\Neos\Ui\Framework\Api\Inbox\Status\Status;
use Neos\Neos\Ui\Framework\Api\Manifest\ManifestInterface;
use Neos\Neos\Ui\Framework\Api\Query\Query;

abstract class Manifest implements ManifestInterface
{
    #[Flow\Inject]
    protected ReflectionService $reflectionService;

    protected string $rootNamespace;

    /**
     * @var class-string<Command>[]|null
     */
    protected ?array $knownCommandClassNames = null;

    /**
     * @var class-string<Query>[]|null
     */
    protected ?array $knownQueryClassNames = null;

    /**
     * @var class-string<Notification>[]|null
     */
    protected ?array $knownNotificationClassNames = null;

    /**
     * @var class-string<Status>[]|null
     */
    protected ?array $knownStatusClassNames = null;

    public function getRootNamespace(): string
    {
        return $this->rootNamespace ??= (new \ReflectionClass(static::class))->getNamespaceName();
    }

    /**
     * @param class-string<Command> $commandClassName
     * @return boolean
     */
    public function isKnownCommandClassName(string $commandClassName): bool
    {
        return \str_starts_with($commandClassName, $this->getRootNamespace());
    }

    /**
     * @param class-string<Query> $queryClassName
     * @return boolean
     */
    public function isKnownQueryClassName(string $queryClassName): bool
    {
        return \str_starts_with($queryClassName, $this->getRootNamespace());
    }

    /**
     * @param class-string<Notification> $notificationClassName
     * @return boolean
     */
    public function isKnownNotificationClassName(string $notificationClassName): bool
    {
        return \str_starts_with($notificationClassName, $this->getRootNamespace());
    }

    /**
     * @param class-string<Status> $statusClassName
     * @return boolean
     */
    public function isKnownStatusClassName(string $statusClassName): bool
    {
        return \str_starts_with($statusClassName, $this->getRootNamespace());
    }

    /**
     * @return class-string<Command>[]
     */
    public function getKnownCommandClassNames(): array
    {
        if ($this->knownCommandClassNames === null) {
            $this->knownCommandClassNames = [];

            foreach ($this->reflectionService->getAllSubClassNamesForClass(Command::class) as $commandClassName) {
                if ($this->isKnownCommandClassName($commandClassName)) {
                    $this->knownCommandClassNames[] = $commandClassName;
                }
            }
        }

        return $this->knownCommandClassNames;
    }

    /**
     * @return class-string<Query>[]
     */
    public function getKnownQueryClassNames(): array
    {
        if ($this->knownQueryClassNames === null) {
            $this->knownQueryClassNames = [];

            foreach ($this->reflectionService->getAllSubClassNamesForClass(Query::class) as $queryClassName) {
                if ($this->isKnownQueryClassName($queryClassName)) {
                    $this->knownQueryClassNames[] = $queryClassName;
                }
            }
        }

        return $this->knownQueryClassNames;
    }

    /**
     * @return class-string<Notification>[]
     */
    public function getKnownNotificationClassNames(): array
    {
        if ($this->knownNotificationClassNames === null) {
            $this->knownNotificationClassNames = [];

            foreach ($this->reflectionService->getAllSubClassNamesForClass(Notification::class) as $notificationClassName) {
                if ($this->isKnownNotificationClassName($notificationClassName)) {
                    $this->knownNotificationClassNames[] = $notificationClassName;
                }
            }
        }

        return $this->knownNotificationClassNames;
    }

    /**
     * @return class-string<Status>[]
     */
    public function getKnownStatusClassNames(): array
    {
        if ($this->knownStatusClassNames === null) {
            $this->knownStatusClassNames = [];

            foreach ($this->reflectionService->getAllSubClassNamesForClass(Status::class) as $statusClassName) {
                if ($this->isKnownStatusClassName($statusClassName)) {
                    $this->knownStatusClassNames[] = $statusClassName;
                }
            }
        }

        return $this->knownStatusClassNames;
    }
}
