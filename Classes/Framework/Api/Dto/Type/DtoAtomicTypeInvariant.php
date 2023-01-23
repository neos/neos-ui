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
use Neos\Neos\Ui\Framework\Api\Dto\DtoInvariant;
use Neos\Neos\Ui\Framework\Api\Invariant\Invariant;
use Neos\Neos\Ui\Framework\Api\ListDto\ListDto;
use Neos\Neos\Ui\Framework\Api\ListDto\ListDtoInvariant;

#[Flow\Proxy(false)]
final class DtoAtomicTypeInvariant extends Invariant
{
    public static function isSatisfiedByReflectionNamedType(
        \ReflectionNamedType $reflectionNamedType
    ): self {
        $name = $reflectionNamedType->getName();
        $isAllowedBuiltInType = match ($name) {
            'null',
            'bool',
            'int',
            'float',
            'string',
            'mixed' => true,
            default => false
        };

        if ($isAllowedBuiltInType) {
            return self::succeed();
        }

        if (is_a($name, Dto::class, true)) {
            $dtoInvariantCheck = DtoInvariant::isSatisfiedByClassName($name);
            if ($dtoInvariantCheck->verify()) {
                return self::succeed();
            }

            return self::fail(
                sprintf('Type "%s" is not a valid DTO.', $name),
                1673218422,
                $dtoInvariantCheck
            );
        }

        if (is_a($name, ListDto::class, true)) {
            $listDtoInvariantCheck = ListDtoInvariant::isSatisfiedByClassName($name);
            if ($listDtoInvariantCheck->verify()) {
                return self::succeed();
            }

            return self::fail(
                sprintf('Type "%s" is not a valid List DTO.', $name),
                1673218423,
                $listDtoInvariantCheck
            );
        }

        return self::fail(
            sprintf(
                'Type "%s" is not allowed. Allowed types are null, bool, int, float, string, mixed, any valid Dto or any valid ListDto.',
                $name
            ),
            1673218424
        );
    }
}
