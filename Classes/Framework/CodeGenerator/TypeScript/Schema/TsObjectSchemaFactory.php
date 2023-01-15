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

namespace Neos\Neos\Ui\Framework\CodeGenerator\TypeScript\Schema;

use Neos\Neos\Ui\Framework\Api\Dto\ReflectionDto;

final class TsObjectSchemaFactory
{
    public static function fromReflectionDto(ReflectionDto $reflectionDto): TsObjectSchema
    {
        $items = [];

        foreach ($reflectionDto->getProperties() as $reflectionDtoProperty) {
            $items[] = TsPropertySchemaFactory::fromReflectionDtoProperty($reflectionDtoProperty);
        }

        return new TsObjectSchema(...$items);
    }
}
