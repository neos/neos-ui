<?php
namespace Neos\Neos\Ui\Domain\Model\Changes;

class CopyAfter extends AbstractCopy
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
            $this->getSubject()->copyAfter($this->getReference(), $nodeName);
            $this->finish($node);
        }
    }
}
