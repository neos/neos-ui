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
 * This is a container for clipboard state that needs to be persisted server side
 *
 * @Flow\Scope("session")
 */
class ClipboardStateContainer
{
    /**
     * @var string
     */
    protected $clipboardSubject = '';

    /**
     * @var string
     */
    protected $clipboardMode = '';

    /**
     * Set clipboard subject.
     *
     * @param string $clipboardSubject
     * @return void
     * @Flow\Session(autoStart=true)
     */
    public function setClipboardSubject(string $clipboardSubject)
    {
        $this->clipboardSubject = $clipboardSubject;
    }

    /**
     * Set clipboard mode.
     *
     * @param string $clipboardMode
     * @return void
     * @Flow\Session(autoStart=true)
     */
    public function setClipboardMode(string $clipboardMode)
    {
        $this->clipboardMode = $clipboardMode;
    }

    /**
     * Get clipboard subject.
     *
     * @return string $clipboardSubject
     */
    public function getClipboardSubject()
    {
        return $this->clipboardSubject;
    }

    /**
     * Get clipboard mode.
     *
     * @return string $clipboardMode
     */
    public function getClipboardMode()
    {
        return $this->clipboardMode;
    }
}
