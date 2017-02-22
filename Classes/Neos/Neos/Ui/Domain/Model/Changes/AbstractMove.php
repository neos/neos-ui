<?php
namespace Neos\Neos\Ui\Domain\Model\Changes;

use Neos\ContentRepository\Domain\Model\NodeInterface;
use Neos\Neos\Ui\Domain\Model\ChangeInterface;
use Neos\Neos\Ui\Domain\Model\Feedback\Operations\RemoveNode;
use Neos\Neos\Ui\Domain\Model\Feedback\Operations\UpdateNodeInfo;

abstract class AbstractMove extends AbstractStructuralChange
{
    /**
     * Checks whether this change can be merged with a subsequent change
     *
     * @param  ChangeInterface $subsequentChange
     * @return boolean
     */
    public function canMerge(ChangeInterface $subsequentChange)
    {
        if (!$subsequentChange instanceof AbstractMove) {
            return false;
        }

        if ($subsequentChange->getSubject() !== $this->getSubject()) {
            return false;
        }

        return $subsequentChange->canApply();
    }

    /**
     * Merges this change with a subsequent change
     *
     * @param  ChangeInterface $subsequentChange
     * @return void
     */
    public function merge(ChangeInterface $subsequentChange)
    {
        if ($this->canMerge($subsequentChange)) {
            return $subsequentChange;
        }
    }

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
     * Perform finish tasks - needs to be called from inheriting clas on `apply`
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
