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
use Neos\Flow\Annotations as Flow;

class StaticResourcesHelper implements ProtectedContextAwareInterface
{
    /**
     * @Flow\InjectConfiguration("frontendDevelopmentMode")
     * @var boolean
     */
    protected $frontendDevelopmentMode;

    public function compiledResourcePackage()
    {
        if ($this->frontendDevelopmentMode) {
            return 'Neos.Neos.Ui';
        } else {
            return 'Neos.Neos.Ui.Compiled';
        }
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
