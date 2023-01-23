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
use Neos\Neos\Ui\Framework\CodeGenerator\TypeScript\Module\TsModuleInterface;
use Neos\Neos\Ui\Framework\CodeGenerator\TypeScript\Module\TsModulePath;
use Neos\Neos\Ui\Framework\CodeGenerator\TypeScript\Renderable\TsRenderableInterface;

#[Flow\Proxy(false)]
final class TsStatusModule implements TsModuleInterface, TsRenderableInterface
{
    public function __construct(
        public readonly TsModulePath $path,
        public readonly string $exportName,
        public readonly TsDtoModule $eventDto
    ) {
    }

    public function getPath(): TsModulePath
    {
        return $this->path;
    }

    public function getDependencies(): TsDependencies
    {
        return $this->eventDto->dependencies;
    }

    public function render(string $indent = '', bool $trimFirstLine = false): string
    {
        $lines = [];

        // @TODO: Add hint that the file has been generated automatically
        $lines[] = $indent . 'import * as s from "@neos-project/framework-schema";';
        $lines[] = '';

        $lines[] = $indent . 'import { createStatus } from "@neos-project/framework-api";';
        $lines[] = '';

        $dependencies = $this->getDependencies();
        if (!$dependencies->isEmpty()) {
            foreach ($dependencies as $dependency) {
                $lines[] = $indent . 'import { ' . $dependency->dtoTypeName . ' } from "' . $this->path->getRelativePathTo($dependency->path) . '";';
            }
            $lines[] = '';
        }

        $lines[] = $this->eventDto->renderTypeAlias('STATUS_TYPE', $indent, $trimFirstLine);
        $lines[] = '';

        $lines[] = $indent . 'export const ' . $this->exportName . ' = createStatus(';
        $lines[] = $indent . '    STATUS_TYPE,';
        $lines[] = $this->eventDto->renderSchema('STATUS_TYPE', $indent . '    ', false);
        $lines[] = $indent . ');';
        $lines[] = '';

        return implode("\n", $lines);
    }
}
