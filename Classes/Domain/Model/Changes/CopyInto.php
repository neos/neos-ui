<?php

namespace Neos\Neos\Ui\Domain\Model\Changes;

/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

use Neos\ContentRepository\Domain\Model\NodeInterface;

class CopyInto extends AbstractCopy
{
    /**
     * @var string
     */
    protected $parentContextPath;

    /**
     * @var NodeInterface
     */
    protected $cachedParentNode;

    /**
     * @param string $parentContextPath
     */
    public function setParentContextPath($parentContextPath)
    {
        $this->parentContextPath = $parentContextPath;
    }

    /**
     * @return NodeInterface
     */
    public function getParentNode()
    {
        if ($this->cachedParentNode === null) {
            $this->cachedParentNode = $this->nodeService->getNodeFromContextPath(
                $this->parentContextPath
            );
        }

        return $this->cachedParentNode;
    }

    /**
     * "Subject" is the to-be-copied node; the "parent" node is the new parent
     *
     * @return boolean
     */
    public function canApply()
    {
        $nodeType = $this->getSubject()->getNodeType();

        return $this->getParentNode()->isNodeTypeAllowedAsChildNode($nodeType);
    }

    public function getMode()
    {
        return 'into';
    }

    /**
     * Applies this change
     *
     * @return void
     */
    public function apply()
    {
        if ($this->canApply()) {
            $parentNode = $this->getParentNode();
            $nodeName = $this->generateUniqueNodeName($parentNode);
            // If the parent node has children, we copy the node after the last child node to prevent the copied nodes
            // from being mixed with the existing ones due the duplication of their relative indices.
            if ($parentNode->hasChildNodes()) {
                $lastChildNode = array_slice($parentNode->getChildNodes(), -1, 1)[0];
                $node = $this->getSubject()->copyAfter($lastChildNode, $nodeName);
            } else {
                $node = $this->getSubject()->copyInto($parentNode, $nodeName);
            }
            $this->finish($node);
        }
    }
}
