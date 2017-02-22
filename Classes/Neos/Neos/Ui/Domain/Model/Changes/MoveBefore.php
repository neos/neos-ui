<?php
namespace Neos\Neos\Ui\Domain\Model\Changes;

use Neos\Neos\Ui\Domain\Model\Feedback\Operations\UpdateNodeInfo;

class MoveBefore extends AbstractMove
{
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
            $before = clone $this->getSubject();
            $parent = $before->getParent();

            $this->getSubject()->moveBefore($this->getSiblingNode());

            $updateParentNodeInfo = new UpdateNodeInfo();
            $updateParentNodeInfo->setNode($parent);

            $this->feedbackCollection->add($updateParentNodeInfo);

            $this->finish($before);
        }
    }
}
