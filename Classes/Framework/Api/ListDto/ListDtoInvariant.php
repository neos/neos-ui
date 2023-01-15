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
use Neos\Neos\Ui\Framework\Api\Dto\Property\DtoPropertyTypeInvariant;
use Neos\Neos\Ui\Framework\Api\Invariant\Invariant;

#[Flow\Proxy(false)]
final class ListDtoInvariant extends Invariant
{
    public static function isSatisfiedByClassName(string $className): self
    {
        return self::isSatisfiedByReflectionClass(new \ReflectionClass($className));
    }

    public static function isSatisfiedByReflectionClass(\ReflectionClass $reflectionClass): self
    {
        if (!$reflectionClass->isSubclassOf(ListDto::class)) {
            return self::fail(
                sprintf(
                    'Class "%s" is not a List DTO, because it does not extend "%s".',
                    $reflectionClass->getName(),
                    ListDto::class
                ),
                1673218630
            );
        }

        $reflectionConstructor = $reflectionClass->getConstructor();
        if (!$reflectionConstructor) {
            return self::fail(
                sprintf(
                    'Class "%s" has no constructor.',
                    $reflectionClass->getName()
                ),
                1673218631
            );
        }

        if (!$reflectionConstructor->isPublic()) {
            return self::fail(
                sprintf(
                    'Class "%s" must have a public constructor, but has a %s one.',
                    $reflectionClass->getName(),
                    match (true) {
                        $reflectionConstructor->isProtected() => 'protected',
                        $reflectionConstructor->isPrivate() => 'private',
                        default => 'unspecified'
                    }
                ),
                1673218632
            );
        }

        if ($reflectionConstructor->getNumberOfParameters() !== 1) {
            return self::fail(
                sprintf(
                    'Class "%s"\'s constructor must have exactly one parameter, but has %s.',
                    $reflectionClass->getName(),
                    $reflectionConstructor->getNumberOfParameters()
                ),
                1673218633
            );
        }

        [$reflectionParameter] = $reflectionConstructor->getParameters();
        $reflectionParameterType = $reflectionParameter->getType();

        if ($reflectionParameterType === null) {
            return self::fail(
                sprintf(
                    'Class "%s"\'s constructor\'s parameter "%s" does not have a type.',
                    $reflectionClass->getName(),
                    $reflectionParameter->getName()
                ),
                1673218634
            );
        }

        if (!$reflectionParameter->isVariadic()) {
            return self::fail(
                sprintf(
                    'Class "%s"\'s constructor\'s parameter "%s" is not variadic.',
                    $reflectionClass->getName(),
                    $reflectionParameter->getName()
                ),
                1673218635
            );
        }

        $parameterCheck = DtoPropertyTypeInvariant::isSatisfiedByReflectionType($reflectionParameterType);
        if (!$parameterCheck->verify()) {
            return self::fail(
                sprintf(
                    'Class "%s"\'s constructor\'s parameter "%s" has an invalid type.',
                    $reflectionParameter->getName(),
                    $reflectionClass->getName()
                ),
                1673218636,
                $parameterCheck
            );
        }

        return self::succeed();
    }
}
