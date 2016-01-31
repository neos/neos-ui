<?php
namespace PackageFactory\Guevara\Domain\Model\Changes;

class CreateAfter extends AbstractCreate
{
    /**
     * Check if the new node's node type is allowed in the requested position
     *
     * @return boolean
     */
    public function canApply()
    {
        $parent = $this->getSubject()->getParent();
        $grandParent = $parent->getParent();
        $nodeType = $this->getNodeType();

        return $parent->isNodeTypeAllowedAsChildNode($nodeType);
    }

    /**
     * Create a new node after the subject
     *
     * @return void
     */
    public function apply()
    {
        if ($this->canApply()) {
            $subject = $this->getSubject();
            $parent = $subject->getParent();
            $node = $this->createNode($parent);

            $node->moveAfter($subject);
        }
    }
}
