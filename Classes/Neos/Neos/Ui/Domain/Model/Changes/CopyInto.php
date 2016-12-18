<?php
namespace Neos\Neos\Ui\Domain\Model\Changes;

class CopyInto extends AbstractCopy
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
            $nodeName = $this->generateUniqueNodeName($this->getParentNode());
            $node = $this->getSubject()->copyInto($this->getParentNode(), $nodeName);
            $this->finish($node);
        }
    }
}
