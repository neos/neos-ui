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
            $before = clone $this->getSubject();
            $this->getSubject()->moveInto($this->getParentNode());
            $this->finish($before);
        }
    }
}
