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

use Neos\Neos\Ui\Domain\Model\AbstractChange;
use Neos\Neos\Ui\Domain\Model\Feedback\Operations\RemoveNode;
use Neos\Neos\Ui\Domain\Model\Feedback\Operations\UpdateNodeInfo;

/**
 * Removes a node
 */
class Remove extends AbstractChange
{
    /**
     * Checks whether this change can be applied to the subject
     *
     * @return boolean
     */
    public function canApply()
    {
        return true;
    }

    /**
     * Applies this change
     *
     * @return void
     */
    public function apply()
    {
        if ($this->canApply()) {
            $node = $this->getSubject();
            $node->remove();

            $this->updateWorkspaceInfo();

            $removeNode = new RemoveNode();
            $removeNode->setNode($node);

            $this->feedbackCollection->add($removeNode);

            $updateParentNodeInfo = new UpdateNodeInfo();
            $updateParentNodeInfo->setNode($node->getParent());

            $this->feedbackCollection->add($updateParentNodeInfo);
        }
    }
}
