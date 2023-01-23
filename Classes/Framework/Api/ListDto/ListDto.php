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

/**
 * @template T of Dto
 * @implements \IteratorAggregate<T>
 */
#[Flow\Proxy(false)]
abstract class ListDto implements \Countable, \IteratorAggregate, \JsonSerializable
{
    /**
     * @param T[] $items
     */
    protected function __construct(public readonly array $items)
    {
    }

    public static function fromArray(array $json): static
    {
        $reflectionListDto = new \ReflectionClass(static::class);
        $itemClassName = $reflectionListDto->getConstructor()->getParameters()[0]->getType()->getName();

        $items = [];

        foreach ($json as $rawItem) {
            $items[] = $itemClassName::fromArray($rawItem);
        }

        return new static(...$items);
    }

    /**
     * @param callable(T):T $mapFn
     * @return static
     */
    public function map(callable $mapFn): static
    {
        $nextItems = [];

        foreach ($this->items as $item) {
            $nextItems[] = $mapFn($item);
        }

        return new static(...$nextItems);
    }

    /**
     * @param callable(T):bool $filterFn
     * @return static
     */
    public function filter(callable $filterFn): static
    {
        $nextItems = [];

        foreach ($this->items as $item) {
            if ($filterFn($item)) {
                $nextItems[] = $item;
            }
        }

        return new static(...$nextItems);
    }

    /**
     * @return \Traversable<T>
     */
    public function getIterator(): \Traversable
    {
        yield from $this->items;
    }

    public function count(): int
    {
        return count($this->items);
    }

    public function jsonSerialize(): mixed
    {
        return $this->items;
    }
}
