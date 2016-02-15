<?php
namespace PackageFactory\Guevara\Domain\Model\Changes;

use TYPO3\Flow\Annotations as Flow;

class Create extends AbstractCreate
{
    /**
     * Check if the new node's node type is allowed in the requested position
     *
     * @return boolean
     */
    public function canApply()
    {
        $subject = $this->getSubject();
        $parent = $subject->getParent();
        $nodeType = $this->getNodeType();

        return $subject->isNodeTypeAllowedAsChildNode($nodeType);
    }

    /**
     * Create a new node beneath the subject
     *
     * @return void
     */
    public function apply()
    {
        if ($this->canApply()) {
            $subject = $this->getSubject();
            $this->createNode($subject);
        }
    }
}
