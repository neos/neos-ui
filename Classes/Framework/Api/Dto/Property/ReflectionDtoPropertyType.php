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
use Neos\Neos\Ui\Framework\Api\Dto\Type\ReflectionDtoAtomicType;

#[Flow\Proxy(false)]
final class ReflectionDtoPropertyType
{
    public function __construct(private readonly \ReflectionType $reflectionType)
    {
        DtoPropertyTypeInvariant::isSatisfiedByReflectionType($reflectionType);
    }

    /**
     * @return ReflectionDtoAtomicType[]
     */
    public function getMemberTypes(): array
    {
        if ($this->reflectionType instanceof \ReflectionNamedType) {
            return [new ReflectionDtoAtomicType($this->reflectionType)];
        }

        /** @var \ReflectionUnionType */
        $reflectionType = $this->reflectionType;

        return array_map(
            fn (\ReflectionNamedType $type) => new ReflectionDtoAtomicType($type),
            array_values($reflectionType->getTypes())
        );
    }

    public function isNullable(): bool
    {
        return $this->reflectionType->allowsNull();
    }
}
