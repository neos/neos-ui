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

use Neos\Neos\Ui\Framework\Api\Query\ReflectionQuery;
use Neos\Neos\Ui\Framework\CodeGenerator\TypeScript\Module\TsModulePathFactory;

final class TsQueryModuleFactory
{
    public static function fromReflectionQuery(ReflectionQuery $reflectionQuery): TsQueryModule
    {
        $methodName = lcfirst($reflectionQuery->getShortName());
        $methodName = substr($methodName, 0, -strlen('Query'));

        return new TsQueryModule(
            path: TsModulePathFactory::fromReflectionQuery($reflectionQuery),
            methodName: $methodName,
            queryDto: TsDtoModuleFactory::fromReflectionDto($reflectionQuery->getQueryDto()),
            queryResultDto: TsDtoModuleFactory::fromReflectionDto($reflectionQuery->getQueryResultDto())
        );
    }
}
