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

#[Flow\Proxy(false)]
final class TsModulePath implements \Stringable
{
    private string $dirname;

    public function __construct(private readonly string $value)
    {
    }

    public function getBasename(string $suffix = ''): string
    {
        return basename($this->value, $suffix);
    }

    public function getDirname(): string
    {
        return $this->dirname ??= dirname($this->value);
    }

    public function isNeighbourOf(TsModulePath $other): bool
    {
        return $this->getDirname() === $other->getDirname();
    }

    public function livesBelow(TsModulePath $other): bool
    {
        return str_starts_with($this->getDirname(), $other->getDirname());
    }

    public function getRelativePathTo(TsModulePath $other): TsModulePath
    {
        if ($this->isNeighbourOf($other)) {
            return new TsModulePath('./' . $other->getBasename());
        }

        if ($other->livesBelow($this)) {
            $path = substr($other->getDirname(), strlen($this->getDirname()));
            $path = '.' . $path . DIRECTORY_SEPARATOR . $other->getBasename();

            return new TsModulePath($path);
        }

        if ($this->livesBelow($other)) {
            $numberOfSteps = substr_count(substr($this->getDirname(), strlen($other->getDirname())), DIRECTORY_SEPARATOR);
            $path = str_repeat('..' . DIRECTORY_SEPARATOR, $numberOfSteps) . $other->getBasename();

            return new TsModulePath($path);
        }

        $minimumDirnameLength = min(strlen($this->getDirname()), strlen($other->getDirname()));
        for (
            $lengthOfCommonRootPath = 0;
            $lengthOfCommonRootPath < $minimumDirnameLength && (
                $this->getDirname()[$lengthOfCommonRootPath] ==
                    $other->getDirname()[$lengthOfCommonRootPath]
            );
            $lengthOfCommonRootPath++
        );

        $commonRootPath = substr($this->getDirname(), 0, $lengthOfCommonRootPath - 1);
        $numberOfSteps = substr_count(substr($this->getDirname(), strlen($commonRootPath)), DIRECTORY_SEPARATOR);

        $path = substr($other->getDirname(), strlen($commonRootPath) + 1);
        $path .= DIRECTORY_SEPARATOR . $other->getBasename();
        $path = str_repeat('..' . DIRECTORY_SEPARATOR, $numberOfSteps) . $path;

        return new TsModulePath($path);

    }

    public function __toString()
    {
        return $this->value;
    }
}
