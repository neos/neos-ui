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
use Neos\Neos\Ui\Framework\CodeGenerator\TypeScript\Reference\TsReference;
use Neos\Neos\Ui\Framework\CodeGenerator\TypeScript\Renderable\TsRenderableInterface;
use Neos\Neos\Ui\Framework\CodeGenerator\TypeScript\Schema\TsLiteralSchema;
use Neos\Neos\Ui\Framework\CodeGenerator\TypeScript\Schema\TsObjectSchema;
use Neos\Neos\Ui\Framework\CodeGenerator\TypeScript\Schema\TsPropertySchema;

#[Flow\Proxy(false)]
final class TsDtoModule implements TsModuleInterface, TsRenderableInterface
{
    public function __construct(
        public readonly TsModulePath $path,
        public readonly string $dtoTypeName,
        public readonly string $dtoClassName,
        public readonly TsDependencies $dependencies,
        public readonly TsObjectSchema $dtoSchema,
    ) {
    }

    public function getPath(): TsModulePath
    {
        return $this->path;
    }

    public function getDependencies(): TsDependencies
    {
        return $this->dependencies;
    }

    public function getFactoryName(): string
    {
        return 'create' . $this->dtoTypeName;
    }

    public function renderTypeAlias(string $referenceName, string $indent): string
    {
        $lines = [];

        $lines[] = $indent . 'const ' . $referenceName . ' = ';
        $lines[] = $indent . '    ' . json_encode($this->dtoClassName) . ';';

        return implode("\n", $lines);
    }

    public function renderTypeDeclaration(bool $export, string $indent): string
    {
        return $indent . ($export ? 'export ' : '') . 'type ' . $this->dtoTypeName . ' = s.Infer<typeof ' . $this->dtoTypeName . '>;';
    }

    public function renderSchemaDeclaration(bool $export, string $typeAliasReferenceName, string $indent): string
    {
        return $indent . ($export ? 'export ' : '') .'const ' . $this->dtoTypeName . ' = ' . $this->renderSchema($typeAliasReferenceName, $indent, true) . ';';
    }

    public function renderSchema(string $typeAliasReferenceName, string $indent, bool $trimFirstLine): string
    {
        $schema = $this->dtoSchema->prepend(
            new TsPropertySchema('__type', new TsLiteralSchema(new TsReference($typeAliasReferenceName)))
        );

        return $schema->render($indent, $trimFirstLine);
    }

    public function renderFactory(bool $export, string $typeAliasReferenceName, string $indent): string
    {
        $lines = [];

        $lines[] = $indent . ($export ? 'export ' : '') . 'const ' . $this->getFactoryName() . ' = (';
        $lines[] = $indent . '    properties: Omit<' . $this->dtoTypeName . ', "__type">';
        $lines[] = $indent . '): ' . $this->dtoTypeName . ' =>';
        $lines[] = $indent . '    Object.freeze({ __type: ' . $typeAliasReferenceName . ', ...properties });';

        return implode("\n", $lines);
    }

    public function render(string $indent = '', bool $trimFirstLine = false): string
    {
        $lines = [];

        // @TODO: Add hint that the file has been generated automatically
        $lines[] = ($trimFirstLine ? $indent : '') . 'import * as s from "@neos-project/framework-schema";';
        $lines[] = $indent . '';

        if (!$this->dependencies->isEmpty()) {
            foreach ($this->dependencies as $dependency) {
                $lines[] = $indent . 'import { ' . $dependency->dtoTypeName . ' } from "' . $this->path->getRelativePathTo($dependency->path) . '";';
            }
            $lines[] = '';
        }

        $lines[] = $this->renderTypeAlias('TYPE', $indent);
        $lines[] = '';
        $lines[] = $this->renderTypeDeclaration(true, $indent);
        $lines[] = '';
        $lines[] = $this->renderSchemaDeclaration(true, 'TYPE', $indent);
        $lines[] = '';
        $lines[] = $this->renderFactory(true, 'TYPE', $indent);
        $lines[] = '';

        return implode("\n", $lines);
    }
}
