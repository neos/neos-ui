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

use Neos\Flow\Annotations as Flow;
use Neos\Eel\ProtectedContextAwareInterface;
use Neos\ContentRepository\Domain\Model\Workspace;
use Neos\Neos\Service\UserService;
use Neos\Neos\Domain\Service\UserService as DomainUserService;
use Neos\Neos\Ui\ContentRepository\Service\WorkspaceService;
use Neos\Utility\PositionalArraySorter;

class PositionalArraySorterHelper implements ProtectedContextAwareInterface
{
    /**
     * @param array $array
     * @param string $positionPath
     * @return array
     */
    public function sort($array, $positionPath = 'position')
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
