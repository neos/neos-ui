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

use Neos\Neos\Ui\Framework\Api\Dto\Property\ReflectionDtoPropertyType;
use Neos\Neos\Ui\Framework\Api\Dto\ReflectionDto;
use Neos\Neos\Ui\Framework\CodeGenerator\TypeScript\Module\TsDependencies;
use Neos\Neos\Ui\Framework\CodeGenerator\TypeScript\Module\TsModulePathFactory;
use Neos\Neos\Ui\Framework\CodeGenerator\TypeScript\Schema\TsObjectSchemaFactory;

final class TsDtoModuleFactory
{
    public static function fromReflectionDto(ReflectionDto $reflectionDto): TsDtoModule
    {
        return new TsDtoModule(
            path: TsModulePathFactory::fromReflectionDto($reflectionDto),
            dtoTypeName: $reflectionDto->getShortName(),
            dtoClassName: $reflectionDto->getFullyQualifiedClassName(),
            dependencies: self::getDependenciesFromReflectionDto($reflectionDto),
            dtoSchema: TsObjectSchemaFactory::fromReflectionDto($reflectionDto)
        );
    }

    private static function getDependenciesFromReflectionDto(ReflectionDto $reflectionDto): TsDependencies
    {
        $items = [];

        foreach ($reflectionDto->getProperties() as $reflectionDtoProperty) {
            $items += self::getDependenciesFromReflectionDtoPropertyType($reflectionDto, $reflectionDtoProperty->getType());
        }

        return new TsDependencies(...array_values($items));
    }

    /**
     * @param ReflectionDto $hostReflectionDto
     * @param ReflectionDtoPropertyType $reflectionDtoPropertyType
     * @return array<string,TsDtoModule>
     */
    private static function getDependenciesFromReflectionDtoPropertyType(
        ReflectionDto $hostReflectionDto,
        ReflectionDtoPropertyType $reflectionDtoPropertyType
    ): array {
        $dependencies = [];

        foreach ($reflectionDtoPropertyType->getMemberTypes() as $reflectionDtoAtomicType) {
            if ($reflectionDto = $reflectionDtoAtomicType->toReflectionDto()) {
                $dependency = self::fromReflectionDto($reflectionDto);
                $dependencies[$dependency->dtoTypeName] = $dependency;
            }

            if ($reflectionListDto = $reflectionDtoAtomicType->toReflectionListDto()) {
                $dependencies += self::getDependenciesFromReflectionDtoPropertyType($hostReflectionDto, $reflectionListDto->getItemType());
            }
        }

        return $dependencies;
    }
}
