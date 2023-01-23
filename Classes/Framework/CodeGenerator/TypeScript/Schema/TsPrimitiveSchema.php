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

use Neos\Neos\Ui\Framework\Api\Dto\Type\PrimitiveTypeName;
use Neos\Neos\Ui\Framework\CodeGenerator\TypeScript\Renderable\TsRenderableInterface;

enum TsPrimitiveSchema: string implements TsRenderableInterface
{
    case BOOLEAN = 'boolean';
    case NUMBER = 'number';
    case STRING = 'string';

    public static function fromPrimitiveTypeName(PrimitiveTypeName $primitiveTypeName): self
    {
        return match ($primitiveTypeName) {
            PrimitiveTypeName::BOOL => self::BOOLEAN,

            PrimitiveTypeName::INT,
            PrimitiveTypeName::FLOAT => self::NUMBER,

            PrimitiveTypeName::STRING => self::STRING,
        };
    }

    public function render(string $indent = '', bool $trimFirstLine = false): string
    {
        return ($trimFirstLine ? '' : $indent) . 's.' . $this->value . '()';
    }
}
