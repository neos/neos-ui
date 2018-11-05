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
class NodeClipboard
{
    const MODE_COPY = 'Copy';
    const MODE_MOVE = 'Move';

    /**
     * @var NodeInterface
     */
    protected $node = null;

    /**
     * @var string one of the NodeClipboardInterface::MODE_*  constants
     */
    protected $mode = '';

    /**
     * Save copied node to clipboard.
     *
     * @param NodeInterface $node
     * @return void
     * @Flow\Session(autoStart=true)
     */
    public function copyNode(NodeInterface $node)
    {
        $this->node = $node;
        $this->mode = self::MODE_COPY;
    }

    /**
     * Save cut node to clipboard.
     *
     * @param NodeInterface $node
     * @return void
     * @Flow\Session(autoStart=true)
     */
    public function cutNode(NodeInterface $node)
    {
        $this->node = $node;
        $this->mode = self::MODE_MOVE;
    }

    /**
     * Reset clipboard.
     *
     * @return void
     * @Flow\Session(autoStart=true)
     */
    public function clear()
    {
        $this->node = null;
        $this->mode = '';
    }

    /**
     * Get clipboard node.
     *
     * @return string $nodeContextPath
     */
    public function getNodeContextPath()
    {
        return $this->node ? $this->node->getContextPath() : '';
    }

    /**
     * Get clipboard mode.
     *
     * @return string $mode
     */
    public function getMode()
    {
        return $this->mode;
    }
}
