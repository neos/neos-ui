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
use Neos\Neos\Ui\Framework\Api\Dto\Property\ReflectionDtoProperty;

#[Flow\Proxy(false)]
final class ReflectionDto
{
    public function __construct(private readonly \ReflectionClass $reflectionClass)
    {
        DtoInvariant::isSatisfiedByReflectionClass($reflectionClass)->assert();
    }

    public function getShortName(): string
    {
        return $this->reflectionClass->getShortName();
    }

    public function getFullyQualifiedClassName(): string
    {
        return $this->reflectionClass->getName();
    }

    public function getNamespaceName(): string
    {
        return $this->reflectionClass->getNamespaceName();
    }

    /**
     * @return \Traversable<string,ReflectionDtoProperty>
     */
    public function getProperties(): \Traversable
    {
        $publicProperties = $this->reflectionClass
            ->getProperties(\ReflectionProperty::IS_PUBLIC);

        foreach ($publicProperties as $reflectionProperty) {
            yield $reflectionProperty->getName() => new ReflectionDtoProperty($reflectionProperty);
        }
    }
}
