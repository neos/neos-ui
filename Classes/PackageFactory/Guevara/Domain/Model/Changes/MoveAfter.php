<?php
namespace Neos\Neos\Ui\Domain\Model\Changes;

class MoveAfter extends AbstractMove
{
    /**
     * Applies this change
     *
     * @return void
     */
    public function apply()
    {
        if ($this->canApply()) {
            $this->getSubject()->moveAfter($this->getReference());
            $this->updateWorkspaceInfo();
        }
    }
}
