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
use Neos\Neos\Ui\Framework\Api\Invariant\Invariant;

#[Flow\Proxy(false)]
final class DtoPropertyInvariant extends Invariant
{
    public static function isSatisfiedByReflectionProperty(\ReflectionProperty $reflectionProperty): self
    {
        if (!$reflectionProperty->isPublic()) {
            return self::fail(
                sprintf(
                    'Property "%s" must be public, but is %s.',
                    $reflectionProperty->getName(),
                    match (true) {
                        $reflectionProperty->isProtected() => 'protected',
                        $reflectionProperty->isPrivate() => 'private',
                        default => 'unspecified'
                    }
                ),
                1673216763
            );
        }

        if (!$reflectionProperty->isReadOnly()) {
            return self::fail(
                sprintf(
                    'Property "%s" is not read-only.',
                    $reflectionProperty->getName()
                ),
                1673216764
            );
        }

        if (!$reflectionProperty->isReadOnly()) {
            return self::fail(
                sprintf(
                    'Property "%s" is not promoted via constructor.',
                    $reflectionProperty->getName()
                ),
                1673216765
            );
        }

        $type = $reflectionProperty->getType();

        if ($type === null) {
            return self::fail(
                sprintf(
                    'Property "%s" does not have a type.',
                    $reflectionProperty->getName()
                ),
                1673216766
            );
        }

        $dtoPropertyTypeInvariantCheck = DtoPropertyTypeInvariant::isSatisfiedByReflectionType($type);
        if (!$dtoPropertyTypeInvariantCheck->verify()) {
            return self::fail(
                sprintf(
                    'Property "%s" has an invalid type.',
                    $reflectionProperty->getName()
                ),
                1673216767,
                $dtoPropertyTypeInvariantCheck
            );
        }

        return self::succeed();
    }
}
