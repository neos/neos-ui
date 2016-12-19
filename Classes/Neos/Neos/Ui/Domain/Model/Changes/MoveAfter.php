<?php
namespace Neos\Neos\Ui\Domain\Model\Changes;

class MoveAfter extends AbstractMove
{
    public function getMode()
    {
        return 'after';
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
            $this->getSubject()->moveAfter($this->getSiblingNode());
            $this->finish($before);
        }
    }
}
