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

namespace Neos\Neos\Ui\Framework\CodeGenerator\TypeScript\Module;

use Neos\Neos\Ui\Framework\Api\Command\ReflectionCommand;
use Neos\Neos\Ui\Framework\Api\Dto\ReflectionDto;
use Neos\Neos\Ui\Framework\Api\Inbox\Notification\ReflectionNotification;
use Neos\Neos\Ui\Framework\Api\Inbox\Status\ReflectionStatus;
use Neos\Neos\Ui\Framework\Api\Query\ReflectionQuery;

final class TsModulePathFactory
{
    public static function fromReflectionCommand(ReflectionCommand $reflectionCommand): TsModulePath
    {
        $filePath = $reflectionCommand->getFullyQualifiedClassName();
        $filePath = str_replace('\\', DIRECTORY_SEPARATOR, $filePath);

        return new TsModulePath($filePath);
    }

    public static function fromReflectionQuery(ReflectionQuery $reflectionQuery): TsModulePath
    {
        $filePath = $reflectionQuery->getFullyQualifiedClassName();
        $filePath = str_replace('\\', DIRECTORY_SEPARATOR, $filePath);

        return new TsModulePath($filePath);
    }

    public static function fromReflectionNotification(ReflectionNotification $reflectionNotification): TsModulePath
    {
        $filePath = $reflectionNotification->getFullyQualifiedClassName();
        $filePath = str_replace('\\', DIRECTORY_SEPARATOR, $filePath);

        return new TsModulePath($filePath);
    }

    public static function fromReflectionStatus(ReflectionStatus $reflectionStatus): TsModulePath
    {
        $filePath = $reflectionStatus->getFullyQualifiedClassName();
        $filePath = str_replace('\\', DIRECTORY_SEPARATOR, $filePath);

        return new TsModulePath($filePath);
    }

    public static function fromReflectionDto(ReflectionDto $reflectionDto): TsModulePath
    {
        $filePath = $reflectionDto->getFullyQualifiedClassName();
        $filePath = str_replace('\\', DIRECTORY_SEPARATOR, $filePath);

        return new TsModulePath($filePath);
    }
}
