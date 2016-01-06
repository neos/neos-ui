<?php
namespace PackageFactory\Guevara\Domain\Model\Changes;

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

        return $subject->getNodeType()->allowsChildNodeType($nodeType) &&
            $parent->getNodeType()->allowsGrandchildNodeType($subject->getName(), $nodeType);
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
