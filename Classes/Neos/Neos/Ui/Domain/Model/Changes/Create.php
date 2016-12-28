<?php
namespace Neos\Neos\Ui\Domain\Model\Changes;

class Create extends AbstractCreate
{
    /**
     * Get the insertion mode (before|after|into) that is represented by this change
     *
     * @return string
     */
    public function getMode()
    {
        return 'into';
    }

    /**
     * Check if the new node's node type is allowed in the requested position
     *
     * @return boolean
     */
    public function canApply()
    {
        $subject = $this->getSubject();
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
            $this->updateWorkspaceInfo();
        }
    }
}
