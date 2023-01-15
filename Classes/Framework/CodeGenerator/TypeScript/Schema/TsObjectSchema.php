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
final class TsObjectSchema implements TsRenderableInterface
{
    /**
     * @var TsPropertySchema[]
     */
    public readonly array $items;

    public function __construct(TsPropertySchema ...$items)
    {
        $this->items = $items;
    }

    public function prepend(TsPropertySchema $tsPropertySchema): self
    {
        return new self($tsPropertySchema, ...$this->items);
    }

    public function render(string $indent = '', bool $trimFirstLine = false): string
    {
        $lines = [];

        $lines[] = 's.object({';

        foreach ($this->items as $item) {
            $lines[] = $item->render($indent . '    ') . ',';
        }

        $lines[] = $indent . '})';

        $schema = implode("\n", $lines);
        return $trimFirstLine ? $schema : $indent . $schema;
    }
}
