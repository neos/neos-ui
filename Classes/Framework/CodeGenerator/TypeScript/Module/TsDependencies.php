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

namespace Neos\Neos\Ui\Framework\CodeGenerator\TypeScript\Module;

use Neos\Flow\Annotations as Flow;

/**
 * @implements \IteratorAggregate<TsModuleInterface>
 */
#[Flow\Proxy(false)]
final class TsDependencies implements \IteratorAggregate
{
    /**
     * @var TsModuleInterface[]
     */
    public readonly array $items;

    public function __construct(TsModuleInterface...$items)
    {
        $this->items = $items;
    }

    public function isEmpty(): bool
    {
        return empty($this->items);
    }

    public function append(TsDependencies $other): TsDependencies
    {
        $items = [];

        foreach ($this->items as $item) {
            $items[$item->dtoTypeName] = $item;
        }

        foreach ($other->items as $item) {
            $items[$item->dtoTypeName] = $item;
        }

        return new self(...array_values($items));
    }

    /**
     * @return \Traversable<TsModuleInterface>
     */
    public function getIterator(): \Traversable
    {
        yield from $this->items;
    }

    /**
     * @return \Traversable<TsDtoModule>
     */
    public function getRecursiveIterator(): \Traversable
    {
        $alreadyYieldedTsDependencies = [];

        foreach ($this->items as $item) {
            if (!isset($alreadyYieldedTsDependencies[(string) $item->getPath()])) {
                foreach ($item->getDependencies()->getRecursiveIterator() as $transitiveItem) {
                    if (!isset($alreadyYieldedTsDependencies[(string) $transitiveItem->getPath()])) {
                        yield $transitiveItem;
                        $alreadyYieldedTsDependencies[(string) $transitiveItem->getPath()] = $transitiveItem;
                    }
                }

                yield $item;
                $alreadyYieldedTsDependencies[(string) $item->getPath()] = $item;
            }
        }
    }
}
