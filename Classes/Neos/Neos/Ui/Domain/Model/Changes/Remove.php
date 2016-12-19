<?php
namespace Neos\Neos\Ui\Domain\Model\Changes;

use Neos\Flow\Annotations as Flow;
use Neos\Neos\Ui\Domain\Model\AbstractChange;
use Neos\Neos\Ui\Domain\Model\ChangeInterface;
use Neos\Neos\Ui\Domain\Model\Feedback\Operations\UpdateNodeInfo;
use Neos\Neos\Ui\Domain\Model\Feedback\Operations\RemoveNode;

/**
 * Removes a node
 */
class Remove extends AbstractChange
{
    /**
     * Checks whether this change can be merged with a subsequent change
     *
     * @param  ChangeInterface $subsequentChange
     * @return boolean
     */
    public function canMerge(ChangeInterface $subsequentChange)
    {
        if ($subsequentChange->getSubject() !== $this->getSubject()) {
            return false;
        }

        if ($subsequentChange->getPropertyName() !== $this->getPropertyName()) {
            return false;
        }

        return true;
    }

    /**
     * Merges this change with a subsequent change
     *
     * @param  ChangeInterface $subsequentChange
     * @return ChangeInterface|null
     */
    public function merge(ChangeInterface $subsequentChange)
    {
        if ($this->canMerge($subsequentChange)) {
            return $this;
        }

        return null;
    }

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
