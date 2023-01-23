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
final class TsQueryModule implements TsModuleInterface, TsRenderableInterface
{
    public function __construct(
        public readonly TsModulePath $path,
        public readonly string $methodName,
        public readonly TsDtoModule $queryDto,
        public readonly TsDtoModule $queryResultDto
    ) {
    }

    public function getPath(): TsModulePath
    {
        return $this->path;
    }

    public function getDependencies(): TsDependencies
    {
        return $this->queryDto->dependencies->append($this->queryResultDto->dependencies);
    }

    public function render(string $indent = '', bool $trimFirstLine = false): string
    {
        $lines = [];

        // @TODO: Add hint that the file has been generated automatically
        $lines[] = $indent . 'import * as s from "@neos-project/framework-schema";';
        $lines[] = '';

        $lines[] = $indent . 'import { createQuery } from "@neos-project/framework-api";';
        $lines[] = '';

        $dependencies = $this->getDependencies();
        if (!$dependencies->isEmpty()) {
            foreach ($dependencies as $dependency) {
                $lines[] = $indent . 'import { ' . $dependency->dtoTypeName . ' } from "' . $this->path->getRelativePathTo($dependency->path) . '";';
            }
            $lines[] = '';
        }

        $lines[] = $this->queryDto->renderTypeAlias('QUERY_TYPE', $indent, $trimFirstLine);
        $lines[] = '';
        $lines[] = $this->queryResultDto->renderTypeAlias('QUERY_RESULT_TYPE', $indent, $trimFirstLine);
        $lines[] = '';

        $lines[] = $indent . 'export const ' . $this->methodName . ' = createQuery(';
        $lines[] = $indent . '    QUERY_TYPE,';
        $lines[] = $this->queryDto->renderSchema('QUERY_TYPE', $indent . '    ', false) . ',';
        $lines[] = $this->queryResultDto->renderSchema('QUERY_RESULT_TYPE', $indent . '    ', false);
        $lines[] = $indent . ');';
        $lines[] = '';

        return implode("\n", $lines);
    }
}
