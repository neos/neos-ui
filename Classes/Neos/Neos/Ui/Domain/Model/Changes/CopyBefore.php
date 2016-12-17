<?php
namespace Neos\Neos\Ui\Domain\Model\Changes;

class CopyBefore extends AbstractCopy
{
    /**
     * Applies this change
     *
     * @return void
     */
    public function apply()
    {
        if ($this->canApply()) {
            $nodeName = $this->generateUniqueNodeName($this->getReference()->getParent());
            $this->getSubject()->copyBefore($this->getReference(), $nodeName);
            $this->finish($node);
        }
    }
}
