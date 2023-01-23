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

namespace Neos\Neos\Ui\Framework\CodeGenerator\TypeScript;

use Neos\Flow\Annotations as Flow;
use Neos\Neos\Ui\Framework\Api\Command\ReflectionCommand;
use Neos\Neos\Ui\Framework\Api\Inbox\Notification\ReflectionNotification;
use Neos\Neos\Ui\Framework\Api\Inbox\Status\ReflectionStatus;
use Neos\Neos\Ui\Framework\Api\Manifest\ManifestInterface;
use Neos\Neos\Ui\Framework\Api\Query\ReflectionQuery;
use Neos\Neos\Ui\Framework\CodeGenerator\TypeScript\Module\TsDependencies;
use Neos\Neos\Ui\Framework\CodeGenerator\TypeScript\Module\TsModulePath;

#[Flow\Proxy(false)]
final class TsIndexModuleFactory
{
    public static function forManifest(ManifestInterface $manifest): TsIndexModule
    {
        $path = str_replace('\\', DIRECTORY_SEPARATOR, $manifest->getRootNamespace());
        $path = $path . DIRECTORY_SEPARATOR . 'index';

        $commandModules = [];
        foreach ($manifest->getKnownCommandClassNames() as $commandClassName) {
            $reflectionCommand = new ReflectionCommand(
                new \ReflectionClass($commandClassName)
            );

            $commandModules[] = TsCommandModuleFactory::fromReflectionCommand($reflectionCommand);
        }

        $queryModules = [];
        foreach ($manifest->getKnownQueryClassNames() as $queryClassName) {
            $reflectionQuery = new ReflectionQuery(
                new \ReflectionClass($queryClassName)
            );

            $queryModules[] = TsQueryModuleFactory::fromReflectionQuery($reflectionQuery);
        }

        $notificationModules = [];
        foreach ($manifest->getKnownNotificationClassNames() as $notificationClassName) {
            $reflectionNotification = new ReflectionNotification(
                new \ReflectionClass($notificationClassName)
            );

            $notificationModules[] = TsNotificationModuleFactory::fromReflectionNotification($reflectionNotification);
        }

        $statusModules = [];
        foreach ($manifest->getKnownStatusClassNames() as $statusClassName) {
            $reflectionStatus = new ReflectionStatus(
                new \ReflectionClass($statusClassName)
            );

            $statusModules[] = TsStatusModuleFactory::fromReflectionStatus($reflectionStatus);
        }

        return new TsIndexModule(
            path: new TsModulePath($path),
            dependencies: new TsDependencies(
                ...$commandModules,
                ...$queryModules,
                ...$notificationModules,
                ...$statusModules,
            )
        );
    }
}
