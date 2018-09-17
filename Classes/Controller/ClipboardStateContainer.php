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
use Neos\ContentRepository\Domain\Model\NodeInterface;

/**
 * This is a container for clipboard state that needs to be persisted server side
 *
 * @Flow\Scope("session")
 */
class ClipboardStateContainer
{
    /**
     * @var NodeInterface
     */
    protected $clipboardSubject = null;

    /**
     * @var string
     */
    protected $clipboardMode = '';

    /**
     * Save copied node to clipboard.
     *
     * @param NodeInterface $clipboardSubject
     * @return void
     * @Flow\Session(autoStart=true)
     */
    public function copyNode(NodeInterface $clipboardSubject)
    {
        $this->clipboardSubject = $clipboardSubject;
        $this->clipboardMode = 'Copy';
    }

    /**
     * Save cut node to clipboard.
     *
     * @param NodeInterface $clipboardSubject
     * @return void
     * @Flow\Session(autoStart=true)
     */
    public function cutNode(NodeInterface $clipboardSubject)
    {
        $this->clipboardSubject = $clipboardSubject;
        $this->clipboardMode = 'Cut';
    }

    /**
     * Get clipboard subject.
     *
     * @return string $clipboardSubject
     */
    public function getClipboardSubject()
    {
        return $this->clipboardSubject ? $this->clipboardSubject->getContextPath() : '';
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
