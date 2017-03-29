<?php
namespace Neos\Neos\Ui\Domain\Model;

use Neos\ContentRepository\Domain\Model\NodeInterface;

/**
 * An interface to describe a change
 */
interface ChangeInterface
{

    /**
     * Set the subject
     *
     * @param NodeInterface $subject
     * @return void
     */
    public function setSubject(NodeInterface $subject);

    /**
     * Get the subject
     *
     * @return NodeInterface
     */
    public function getSubject();

    /**
     * Checks whether this change can be applied to the subject
     *
     * @return boolean
     */
    public function canApply();

    /**
     * Applies this change
     *
     * @return void
     */
    public function apply();

}
