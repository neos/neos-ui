<?php
namespace Neos\Neos\Ui\Domain\Model\Changes;

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
            $this->getSubject()->moveBefore($this->getSiblingNode());
            $this->finish($before);
        }
    }
}
