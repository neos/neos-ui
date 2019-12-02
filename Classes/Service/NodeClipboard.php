<?php
namespace Neos\Neos\Ui\Service;

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
     * @var string
     */
    protected $nodeContextPaths = [];

    /**
     * @var string one of the NodeClipboard::MODE_*  constants
     */
    protected $mode = '';

    /**
     * Save copied node to clipboard.
     *
     * @param NodeInterface[] $nodes
     * @return void
     * @Flow\Session(autoStart=true)
     */
    public function copyNodes(array $nodes)
    {
        $this->nodeContextPaths = array_map(function ($node) {
            return $node->getContextPath();
        }, $nodes);
        $this->mode = self::MODE_COPY;
    }

    /**
     * Save cut nodes to clipboard.
     *
     * @param NodeInterface[] $nodes
     * @return void
     * @Flow\Session(autoStart=true)
     */
    public function cutNodes(array $nodes)
    {
        $this->nodeContextPaths = array_map(function ($node) {
            return $node->getContextPath();
        }, $nodes);
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
        $this->nodeContextPaths = [];
        $this->mode = '';
    }

    /**
     * Get clipboard node.
     *
     * @return array $nodeContextPath
     */
    public function getNodeContextPaths()
    {
        return $this->nodeContextPaths ? $this->nodeContextPaths : [];
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
