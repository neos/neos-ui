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

use Neos\Neos\Ui\Framework\Api\Command\ReflectionCommand;
use Neos\Neos\Ui\Framework\CodeGenerator\TypeScript\Module\TsModulePathFactory;

final class TsCommandModuleFactory
{
    public static function fromReflectionCommand(ReflectionCommand $reflectionCommand): TsCommandModule
    {
        $methodName = lcfirst($reflectionCommand->getShortName());
        $methodName = substr($methodName, 0, -strlen('Command'));

        return new TsCommandModule(
            path: TsModulePathFactory::fromReflectionCommand($reflectionCommand),
            methodName: $methodName,
            commandDto: TsDtoModuleFactory::fromReflectionDto($reflectionCommand->getCommandDto())
        );
    }
}
