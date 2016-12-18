<?php
namespace Neos\Neos\Ui\Domain\Model\Changes;

class CopyAfter extends AbstractCopy
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
            $nodeName = $this->generateUniqueNodeName($this->getParentNode());
            $node = $this->getSubject()->copyAfter($this->getSiblingNode(), $nodeName);
            $this->finish($node);
        }
    }
}
