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

namespace Neos\Neos\Ui\Framework\Api\Dto\Property;

use Neos\Flow\Annotations as Flow;
use Neos\Neos\Ui\Framework\Api\Dto\Dto;
use Neos\Neos\Ui\Framework\Api\ListDto\ListDto;
use Neos\Utility\TypeHandling;

#[Flow\Proxy(false)]
final class ReflectionDtoProperty
{
    public function __construct(private readonly \ReflectionProperty $reflectionProperty)
    {
        DtoPropertyInvariant::isSatisfiedByReflectionProperty($reflectionProperty)->assert();
    }

    public function getPropertyName(): string
    {
        return $this->reflectionProperty->getName();
    }

    public function getType(): ReflectionDtoPropertyType
    {
        return new ReflectionDtoPropertyType($this->reflectionProperty->getType());
    }

    public function sanitizeValue(mixed $value): mixed
    {
        // @TODO: This needs refactoring
        $reflectionType = $this->reflectionProperty->getType();
        if ($reflectionType?->allowsNull() && is_null($value)) {
            return $value;
        }

        $allowedTypes = $reflectionType instanceof \ReflectionUnionType
            ? $reflectionType->getTypes()
            : [$reflectionType];

        foreach ($allowedTypes as $allowedType) {
            switch (true) {
                case $allowedType?->getName() === 'bool' && is_bool($value):
                case $allowedType?->getName() === 'int' && is_int($value):
                case $allowedType?->getName() === 'float' && is_float($value):
                case $allowedType?->getName() === 'string' && is_string($value):
                case $allowedType?->getName() === 'mixed':
                    return $value;
                case is_a($allowedType?->getName(), Dto::class, true) && is_array($value):
                    return $allowedType->getName()::fromArray($value);
                case is_a($allowedType?->getName(), ListDto::class, true) && is_array($value):
                    return $allowedType->getName()::fromArray($value);
                default:
                    throw SanitizationFailedException::becauseTheGivenValueHasTheWrongTypeAnCannotBeConverted(
                        propertyName: $this->reflectionProperty->getName(),
                        expectedType: $allowedType?->getName(),
                        givenType: TypeHandling::getTypeForValue($value)
                    );
            }
        }
    }
}
