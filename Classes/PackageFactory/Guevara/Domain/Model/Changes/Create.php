<?php
namespace PackageFactory\Guevara\Domain\Model\Changes;

use TYPO3\Flow\Annotations as Flow;
use TYPO3\TYPO3CR\Domain\Service\NodeTypeManager;

class Create extends AbstractCreate
{
    /**
     * @var NodeTypeManager
     * @Flow\Inject
     */
    protected $nodeTypeManager;

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
