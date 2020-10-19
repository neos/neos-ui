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

use Neos\Neos\Ui\Domain\Model\Feedback\Operations\UpdateNodeInfo;

class MoveBefore extends AbstractMove
{

    /**
     * "Subject" is the to-be-moved node; the "sibling" node is the node after which the "Subject" should be copied.
     *
     * @return boolean
     */
    public function canApply()
    {
        $nodeType = $this->getSubject()->getNodeType();

        return $this->getSiblingNode()->getParent()->isNodeTypeAllowedAsChildNode($nodeType);
    }

    public function getMode()
    {
        return 'before';
    }

    /**
     * Applies this change
     *
     * @return void
     */
    public function apply()
    {
        if ($this->canApply()) {
            $before = self::cloneNodeWithNodeData($this->getSubject());
            $parent = $before->getParent();

            if ($this->nodeNameAvailableBelowNode($this->getSiblingNode()->getParent(), $this->getSubject())) {
                $this->getSubject()->moveBefore($this->getSiblingNode());
            } else {
                $nodeName = $this->generateUniqueNodeName($this->getSiblingNode()->getParent());
                $this->getSubject()->moveBefore($this->getSiblingNode(), $nodeName);
            }

            $updateParentNodeInfo = new UpdateNodeInfo();
            $updateParentNodeInfo->setNode($parent);
            if ($this->baseNodeType) {
                $updateParentNodeInfo->setBaseNodeType($this->baseNodeType);
            }

            $this->feedbackCollection->add($updateParentNodeInfo);

            $this->finish($before);
        }
    }
}
