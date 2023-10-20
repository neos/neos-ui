<?php
namespace Neos\Neos\Ui\Fusion\Helper;

/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

use Neos\Eel\ProtectedContextAwareInterface;
use Neos\Utility\PositionalArraySorter;

class PositionalArraySorterHelper implements ProtectedContextAwareInterface
{
    /**
     * @param array<int|string, mixed> $array
     * @param string $positionPath
     * @return array<int|string, mixed>
     */
    public function sort(array $array, string $positionPath = 'position'): array
    {
        return (new PositionalArraySorter($array, $positionPath))->toArray();
    }

    /**
     * @param string $methodName
     * @return boolean
     */
    public function allowsCallOfMethod($methodName)
    {
        return true;
    }
}
