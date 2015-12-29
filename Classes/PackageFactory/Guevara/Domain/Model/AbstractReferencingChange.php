<?php
namespace PackageFactory\Guevara\Domain\Model;

use TYPO3\TYPO3CR\Domain\Model\NodeInterface;

abstract class AbstractReferencingChange extends AbstractChange implements ReferencingChangeInterface
{
    /**
     * The reference
     *
     * @var NodeInterface
     */
    protected $reference;

    /**
     * Set the reference
     *
     * @param NodeInterface $reference
     * @return void
     */
    public function setReference(NodeInterface $reference)
    {
        $this->reference = $reference;
    }

    /**
     * Get the reference
     *
     * @return NodeInterface
     */
    public function getReference()
    {
        return $this->reference;
    }
}
