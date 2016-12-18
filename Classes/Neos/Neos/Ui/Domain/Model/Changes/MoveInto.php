<?php
namespace Neos\Neos\Ui\Domain\Model\Changes;

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
            $this->getSubject()->moveInto($this->getReference());
            $this->updateWorkspaceInfo();
        }
    }
}
