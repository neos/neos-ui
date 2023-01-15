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

namespace Neos\Neos\Ui\Framework\CodeGenerator\TypeScript;

use Neos\Flow\Annotations as Flow;
use Neos\Neos\Ui\Framework\CodeGenerator\TypeScript\Module\TsDependencies;
use Neos\Neos\Ui\Framework\CodeGenerator\TypeScript\Module\TsModulePath;
use Neos\Neos\Ui\Framework\CodeGenerator\TypeScript\Renderable\TsRenderableInterface;

#[Flow\Proxy(false)]
final class TsIndexModule implements TsRenderableInterface
{
    public function __construct(
        public readonly TsModulePath $path,
        public readonly TsDependencies $dependencies
    ) {
    }

    public function render(string $indent = '', bool $trimFirstLine = false): string
    {
        $lines = [];

        // @TODO: Add hint that the file has been generated automatically

        if (!$this->dependencies->isEmpty()) {
            foreach ($this->dependencies->getRecursiveIterator() as $dependency) {
                $lines[] = $indent . 'export * from "' . $this->path->getRelativePathTo($dependency->path) . '";';
            }
        }

        $lines[] = '';

        return implode("\n", $lines);
    }
}
