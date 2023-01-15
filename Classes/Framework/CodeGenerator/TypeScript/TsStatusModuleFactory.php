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

use Neos\Neos\Ui\Framework\Api\Inbox\Status\ReflectionStatus;
use Neos\Neos\Ui\Framework\CodeGenerator\TypeScript\Module\TsModulePathFactory;

final class TsStatusModuleFactory
{
    public static function fromReflectionStatus(ReflectionStatus $reflectionStatus): TsStatusModule
    {
        return new TsStatusModule(
            path: TsModulePathFactory::fromReflectionStatus($reflectionStatus),
            exportName: $reflectionStatus->getShortName(),
            eventDto: TsDtoModuleFactory::fromReflectionDto($reflectionStatus->getStatusDto())
        );
    }
}
