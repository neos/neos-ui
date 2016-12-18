<?php
namespace Neos\Neos\Ui\Domain\Model\Changes;

use Neos\Neos\Ui\Domain\Model\ChangeInterface;

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
        $referenceNode = $this->getReference();
        $referenceNodeParent = $referenceNode->getParent();
        $nodeType = $this->getSubject()->getNodeType();

        return $referenceNode->getNodeType()->allowsChildNodeType($nodeType) &&
            $referenceNodeParent->getNodeType()->allowsGrandchildNodeType($this->getSubject()->getName(), $nodeType);
    }
}
