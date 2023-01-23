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

namespace Neos\Neos\Ui\Framework\Api\Query;

use Neos\Flow\Annotations as Flow;
use Neos\Neos\Ui\Framework\Api\Dto\ReflectionDto;

#[Flow\Proxy(false)]
final class ReflectionQuery
{
    public function __construct(private readonly \ReflectionClass $reflectionClass)
    {
        assert(self::isSatisfiedByReflectionClass($reflectionClass));
    }

    public static function isSatisfiedByReflectionClass(\ReflectionClass $reflectionClass): bool
    {
        return $reflectionClass->isSubclassOf(Query::class);
    }

    public function getShortName(): string
    {
        return $this->reflectionClass->getShortName();
    }

    public function getFullyQualifiedClassName(): string
    {
        return $this->reflectionClass->getName();
    }

    public function getQueryDto(): ReflectionDto
    {
        return new ReflectionDto($this->reflectionClass);
    }

    public function getQueryResultDto(): ReflectionDto
    {
        return new ReflectionDto(
            new \ReflectionClass(
                $this->reflectionClass->getName()::getQueryResultClassName()
            )
        );
    }
}
