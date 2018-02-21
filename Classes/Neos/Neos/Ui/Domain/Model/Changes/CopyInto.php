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

class CopyInto extends AbstractCopy
{
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
            $nodeName = $this->generateUniqueNodeName($this->getParentNode());
            $node = $this->getSubject()->copyInto($this->getParentNode(), $nodeName);
            $this->finish($node);
        }
    }
}
