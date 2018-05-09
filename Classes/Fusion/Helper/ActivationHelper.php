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
use Neos\Flow\Session\SessionInterface;

/**
 * @Flow\Scope("singleton")
 */
class ActivationHelper implements ProtectedContextAwareInterface
{
    /**
     * @Flow\Inject
     * @var SessionInterface
     */
    protected $session;

    public function isLegacyBackendEnabled()
    {
        return $this->session->isStarted() && $this->session->getData('__neosLegacyUiEnabled__') ? true : false;
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
