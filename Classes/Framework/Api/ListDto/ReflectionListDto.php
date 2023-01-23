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

namespace Neos\Neos\Ui\Framework\Api\ListDto;

use Neos\Flow\Annotations as Flow;
use Neos\Neos\Ui\Framework\Api\Dto\Property\ReflectionDtoPropertyType;

#[Flow\Proxy(false)]
final class ReflectionListDto
{
    private readonly \ReflectionClass $dtoReflectionClass;

    public function __construct(string $listDtoClassName)
    {
        assert(self::isSatisfiedByClassName($listDtoClassName));

        $this->dtoReflectionClass = new \ReflectionClass($listDtoClassName);
    }

    public static function isSatisfiedByClassName(string $className): bool
    {
        return is_subclass_of($className, ListDto::class, true);
    }

    public function getItemType(): ReflectionDtoPropertyType
    {
        $reflectionConstructor = $this->dtoReflectionClass->getConstructor();
        $reflectionConstructorParameters = $reflectionConstructor->getParameters();

        return new ReflectionDtoPropertyType($reflectionConstructorParameters[0]->getType());
    }
}
