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
use Neos\Neos\Ui\Framework\Api\Dto\Type\DtoAtomicTypeInvariant;
use Neos\Neos\Ui\Framework\Api\Invariant\Invariant;

#[Flow\Proxy(false)]
final class DtoPropertyTypeInvariant extends Invariant
{
    public static function isSatisfiedByReflectionType(\ReflectionType $reflectionType): self
    {
        if ($reflectionType instanceof \ReflectionNamedType) {
            $dtoAtomicTypeInvariantCheck = DtoAtomicTypeInvariant::isSatisfiedByReflectionNamedType(
                $reflectionType
            );

            if (!$dtoAtomicTypeInvariantCheck->verify()) {
                return self::fail(
                    sprintf(
                        'Type "%s" is not a valid property type.',
                        $reflectionType->getName()
                    ),
                    1673217804,
                    $dtoAtomicTypeInvariantCheck
                );
            }

            return self::succeed();
        }

        if ($reflectionType instanceof \ReflectionUnionType) {
            foreach ($reflectionType->getTypes() as $reflectionType) {
                $recursiveCheck = self::isSatisfiedByReflectionType($reflectionType);
                if (!$recursiveCheck->verify()) {
                    return $recursiveCheck;
                }
            }

            return self::succeed();
        }

        return self::fail('Strange type detected (This may be due to a new PHP version).', 1673217806);
    }
}
