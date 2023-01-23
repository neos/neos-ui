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

namespace Neos\Neos\Ui\Framework\CodeGenerator\TypeScript\Schema;

use Neos\Flow\Annotations as Flow;
use Neos\Neos\Ui\Framework\CodeGenerator\TypeScript\Renderable\TsRenderableInterface;

#[Flow\Proxy(false)]
final class TsUnionSchema implements TsRenderableInterface
{
    /**
     * @var TsRenderableInterface[]
     */
    public readonly array $items;

    public function __construct(TsRenderableInterface ...$items)
    {
        $this->items = $items;
    }

    public function render(string $indent = '', bool $trimFirstLine = false): string
    {
        $breakUp = false;

        $prefix = 's.union(';
        $postfix = ')';

        $members = [];
        $hypotheticalLineLength = strlen($prefix) + strlen($postfix) + ($trimFirstLine ? 0 : strlen($indent));
        foreach ($this->items as $item) {
            $member = $item->render();
            $hypotheticalLineLength += \mb_strlen($member);
            $breakUp = $breakUp || str_contains($member, "\n") || $hypotheticalLineLength > 100;
            $members[] = $member;
        }

        $schema = implode(
            $breakUp ? "\n" : "",
            [
                $prefix,
                implode(
                    $breakUp ? ",\n" : ", ",
                    $members
                ) . ($breakUp ? ",\n" : ""),
            ]
        ) . $postfix;

        return $trimFirstLine ? $schema : $indent . $schema;
    }
}
