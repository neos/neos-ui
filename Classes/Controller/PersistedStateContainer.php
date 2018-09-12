<?php
namespace Neos\Neos\Ui\Controller;

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
use Neos\Error\Messages\Message;

/**
 * This is a container for state that needs to be persisted server side
 *
 * @Flow\Scope("session")
 */
class PersistedStateContainer
{
    /**
     * @var array
     */
    protected $state = [];

    /**
     * Set state.
     *
     * @param array $state
     * @return void
     * @Flow\Session(autoStart=true)
     */
    public function setState(array $state)
    {
        $this->state = $state;
    }

    /**
     * Get state.
     *
     * @return array $state
     */
    public function getState()
    {
        return $this->state;
    }
}
