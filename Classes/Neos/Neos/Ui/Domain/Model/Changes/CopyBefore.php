<?php
namespace Neos\Neos\Ui\Domain\Model\Changes;

class CopyBefore extends AbstractCopy
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
            $nodeName = $this->generateUniqueNodeName($this->getParentNode());
            $node = $this->getSubject()->copyBefore($this->getSiblingNode(), $nodeName);
            $this->finish($node);
        }
    }
}
