<?php
namespace PackageFactory\Guevara\Domain\Model\Changes;

class MoveInto extends AbstractMove
{
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
