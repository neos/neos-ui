<?php
namespace Neos\Neos\Ui\Domain\Model\Changes;

use Neos\Neos\Ui\Domain\Model\Feedback\Operations\UpdateNodeInfo;

class MoveInto extends AbstractMove
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
            $before = clone $this->getSubject();
            $parent = $before->getParent();

            $this->getSubject()->moveInto($this->getParentNode());

            $updateParentNodeInfo = new UpdateNodeInfo();
            $updateParentNodeInfo->setNode($parent);

            $this->feedbackCollection->add($updateParentNodeInfo);

            $this->finish($before);
        }
    }
}
