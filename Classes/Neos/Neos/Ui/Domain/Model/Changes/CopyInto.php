<?php
namespace Neos\Neos\Ui\Domain\Model\Changes;

class CopyInto extends AbstractCopy
{
    /**
     * Applies this change
     *
     * @return void
     */
    public function apply()
    {
        if ($this->canApply()) {
            $nodeName = $this->generateUniqueNodeName($this->getReference());
            $node = $this->getSubject()->copyInto($this->getReference(), $nodeName);
            $this->finish($node);
        }
    }
}
