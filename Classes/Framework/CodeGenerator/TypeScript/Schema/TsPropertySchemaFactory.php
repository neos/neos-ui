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

use Neos\Neos\Ui\Framework\Api\Dto\Property\ReflectionDtoProperty;
use Neos\Neos\Ui\Framework\Api\Dto\Property\ReflectionDtoPropertyType;
use Neos\Neos\Ui\Framework\CodeGenerator\TypeScript\Reference\TsReference;
use Neos\Neos\Ui\Framework\CodeGenerator\TypeScript\Renderable\TsRenderableInterface;

final class TsPropertySchemaFactory
{
    public static function fromReflectionDtoProperty(ReflectionDtoProperty $reflectionDtoProperty): TsPropertySchema
    {
        return new TsPropertySchema(
            propertyName: $reflectionDtoProperty->getPropertyName(),
            propertyTypeSchema: self::getPropertyTypeSchemaFromReflectionDtoPropertyType(
                $reflectionDtoProperty->getType()
            )
        );
    }

    private static function getPropertyTypeSchemaFromReflectionDtoPropertyType(ReflectionDtoPropertyType $reflectionDtoPropertyType): TsRenderableInterface
    {
        $unionMemberSchemas = [];
        foreach ($reflectionDtoPropertyType->getMemberTypes() as $reflectionDtoAtomicType) {
            if ($reflectionDto = $reflectionDtoAtomicType->toReflectionDto()) {
                $unionMemberSchemas[] = new TsReference($reflectionDto->getShortName());
            }

            if ($reflectionListDto = $reflectionDtoAtomicType->toReflectionListDto()) {
                $reflectionDtoPropertyType = $reflectionListDto->getItemType();
                $unionMemberSchemas[] = new TsArraySchema(
                    self::getPropertyTypeSchemaFromReflectionDtoPropertyType($reflectionDtoPropertyType)
                );
            }

            if ($primitiveTypeName = $reflectionDtoAtomicType->toPrimitiveTypeName()) {
                $unionMemberSchemas[] = TsPrimitiveSchema::fromPrimitiveTypeName($primitiveTypeName);
            }
        }

        $propertySchema = match (count($unionMemberSchemas)) {
            0 => new TsUnknownSchema(),
            1 => $unionMemberSchemas[0],
            default => new TsUnionSchema(...$unionMemberSchemas)
        };

        if ($reflectionDtoPropertyType->isNullable()) {
            $propertySchema = new TsOptionalSchema($propertySchema);
        }

        return $propertySchema;
    }
}
