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

namespace Neos\Neos\Ui\Framework\Api\Dto;

use Neos\Flow\Annotations as Flow;
use Neos\Neos\Ui\Framework\Api\Dto\Dto;
use Neos\Neos\Ui\Framework\Api\Dto\Property\DtoPropertyInvariant;
use Neos\Neos\Ui\Framework\Api\Invariant\Invariant;

#[Flow\Proxy(false)]
final class DtoInvariant extends Invariant
{
    public static function isSatisfiedByClassName(string $className): self
    {
        return self::isSatisfiedByReflectionClass(new \ReflectionClass($className));
    }

    public static function isSatisfiedByReflectionClass(\ReflectionClass $reflectionClass): self
    {
        if (!$reflectionClass->isSubclassOf(Dto::class)) {
            return self::fail(
                sprintf(
                    'Class "%s" is not a DTO, because it does not extend "%s".',
                    $reflectionClass->getName(),
                    Dto::class
                ),
                1673212847
            );
        }

        $publicProperties = $reflectionClass
            ->getProperties(\ReflectionProperty::IS_PUBLIC);

        foreach ($publicProperties as $reflectionProperty) {
            $dtoPropertyInvariantCheck = DtoPropertyInvariant::isSatisfiedByReflectionProperty(
                $reflectionProperty
            );

            if (!$dtoPropertyInvariantCheck->verify()) {
                return self::fail(
                    sprintf(
                        'Property "%s" of DTO class "%s" is invalid.',
                        $reflectionProperty->getName(),
                        $reflectionClass->getName()
                    ),
                    1673212848,
                    $dtoPropertyInvariantCheck
                );
            }
        }

        return self::succeed();
    }
}
