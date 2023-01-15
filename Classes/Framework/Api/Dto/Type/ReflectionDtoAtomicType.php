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

namespace Neos\Neos\Ui\Framework\Api\Dto\Type;

use Neos\Flow\Annotations as Flow;
use Neos\Neos\Ui\Framework\Api\Dto\Dto;
use Neos\Neos\Ui\Framework\Api\Dto\ReflectionDto;
use Neos\Neos\Ui\Framework\Api\ListDto\ListDto;
use Neos\Neos\Ui\Framework\Api\ListDto\ReflectionListDto;

#[Flow\Proxy(false)]
final class ReflectionDtoAtomicType
{
    private readonly \ReflectionNamedType $reflectionNamedType;

    public function __construct(?\ReflectionType $reflectionNamedType)
    {
        DtoAtomicTypeInvariant::isSatisfiedByReflectionNamedType($reflectionNamedType)->assert();
        $this->reflectionNamedType = $reflectionNamedType;
    }

    public function toReflectionDto(): ?ReflectionDto
    {
        if (is_a($this->reflectionNamedType->getName(), Dto::class, true)) {
            return new ReflectionDto(new \ReflectionClass($this->reflectionNamedType->getName()));
        }

        return null;
    }

    public function toReflectionListDto(): ?ReflectionListDto
    {
        if (is_a($this->reflectionNamedType->getName(), ListDto::class, true)) {
            return new ReflectionListDto($this->reflectionNamedType->getName());
        }

        return null;
    }

    public function toPrimitiveTypeName(): ?PrimitiveTypeName
    {
        return PrimitiveTypeName::tryFrom($this->reflectionNamedType->getName());
    }
}
