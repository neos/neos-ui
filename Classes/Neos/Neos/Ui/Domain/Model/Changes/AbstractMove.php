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
use Neos\Neos\Ui\Domain\Model\Feedback\Operations\RemoveNode;

abstract class AbstractMove extends AbstractStructuralChange
{
    /**
     * Checks whether this change can be applied to the subject
     *
     * @return boolean
     */
    public function canApply()
    {
        $nodeType = $this->getSubject()->getNodeType();

        return $this->getParentNode()->isNodeTypeAllowedAsChildNode($nodeType);
    }

    /**
     * Perform finish tasks - needs to be called from inheriting class on `apply`
     *
     * @param NodeInterface $node
     * @return void
     */
    protected function finish(NodeInterface $node)
    {
        $removeNode = new RemoveNode();
        $removeNode->setNode($node);

        $this->feedbackCollection->add($removeNode);

        parent::finish($this->getSubject());
    }
}
