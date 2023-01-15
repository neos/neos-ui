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
use Neos\Neos\Ui\Framework\CodeGenerator\TypeScript\Renderable\TsRenderableInterface;

#[Flow\Proxy(false)]
final class TsHeaderComment implements TsRenderableInterface
{
    public function __construct(
        public readonly string $packageName,
        public readonly string $packageDescription,
        public readonly string $year,
    ) {
    }

    public function render(string $indent = '', bool $trimFirstLine = false): string
    {
        $lines = [];

        $lines[] = $indent . '/**';
        $lines[] = $indent . ' *';
        $lines[] = $indent . ' * !!!            !!!  THIS FILE HAS BEEN AUTOGENERATED  !!!          !!!';
        $lines[] = $indent . ' * !!!            !!!     DO NOT MODIFY IT MANUALLY      !!!          !!!';
        $lines[] = $indent . ' *';
        $lines[] = $indent . ' * ' . $this->packageName . ' - ' . $this->packageDescription;
        $lines[] = $indent . ' *   Copyright (C) ' . $this->year . ' Contributors of Neos CMS';
        $lines[] = $indent . ' *';
        $lines[] = $indent . ' *   This program is free software: you can redistribute it and/or modify';
        $lines[] = $indent . ' *   it under the terms of the GNU General Public License as published by';
        $lines[] = $indent . ' *   the Free Software Foundation, either version 3 of the License, or';
        $lines[] = $indent . ' *   (at your option) any later version.';
        $lines[] = $indent . ' *';
        $lines[] = $indent . ' *   This program is distributed in the hope that it will be useful,';
        $lines[] = $indent . ' *   but WITHOUT ANY WARRANTY; without even the implied warranty of';
        $lines[] = $indent . ' *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the';
        $lines[] = $indent . ' *   GNU General Public License for more details.';
        $lines[] = $indent . ' *';
        $lines[] = $indent . ' *   You should have received a copy of the GNU General Public License';
        $lines[] = $indent . ' *   along with this program.  If not, see <https://www.gnu.org/licenses/>.';
        $lines[] = $indent . ' */';
        $lines[] = $indent . '';
        $lines[] = $indent . '';

        return implode("\n", $lines);
    }
}
