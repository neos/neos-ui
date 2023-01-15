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

namespace Neos\Neos\Ui\Framework\CodeGenerator\TypeScript\Reference;

use Neos\Flow\Annotations as Flow;
use Neos\Neos\Ui\Framework\CodeGenerator\TypeScript\Renderable\TsRenderableInterface;

#[Flow\Proxy(false)]
final class TsReference implements TsRenderableInterface
{
    public function __construct(
        public readonly string $value
    ) {
    }

    public function render(string $indent = '', bool $trimFirstLine = false): string
    {
        return ($trimFirstLine ? '' : $indent) . $this->value;
    }
}
