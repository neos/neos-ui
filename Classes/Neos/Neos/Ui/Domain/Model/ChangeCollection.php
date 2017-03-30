<?php
namespace Neos\Neos\Ui\Domain\Model;

/**
 * A collection of changes
 */
class ChangeCollection
{
    /**
     * Changes in this collection
     *
     * @var array
     */
    protected $changes = [];

    /**
     * Add a change to this collection
     *
     * @param ChangeInterface $change
     * @return void
     */
    public function add(ChangeInterface $change)
    {
        $this->changes[] = $change;
    }

    /**
     * Apply all changes
     *
     * @return void
     */
    public function apply()
    {
        while ($change = array_shift($this->changes)) {
            if ($change->canApply()) {
                $change->apply();
            }
        }
    }

    /**
     * Get the number of changes in this collection
     *
     * @return integer
     */
    public function count()
    {
        return count($this->changes);
    }

}
