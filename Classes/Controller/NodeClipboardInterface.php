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
use Neos\ContentRepository\Domain\Model\NodeInterface;

/**
 * An interface for clipboard state that needs to be persisted server side
 */
interface NodeClipboardInterface
{
    /**
     * Save copied node to clipboard.
     *
     * @param NodeInterface $clipboardNode
     * @return void
     */
    public function copyNode(NodeInterface $clipboardNode);

    /**
     * Save cut node to clipboard.
     *
     * @param NodeInterface $clipboardNode
     * @return void
     */
    public function cutNode(NodeInterface $clipboardNode);

    /**
     * Get clipboard node context path.
     *
     * @return string $nodeContextPath
     */
    public function getNodeContextPath();

    /**
     * Get clipboard mode.
     *
     * @return string $clipboardMode
     */
    public function getMode();
}
