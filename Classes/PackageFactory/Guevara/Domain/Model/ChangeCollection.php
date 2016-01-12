<?php
namespace PackageFactory\Guevara\Domain\Model;

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
     * Reduce this collection to a minimal set of changes with the same outcome
     *
     * @return ChangeCollection
     */
    public function compress()
    {
        $compressedChangeCollection = new ChangeCollection();

        while($change = array_shift($this->changes)) {
            if ($subsequentChange = array_shift($this->changes)) {
                if ($change->canMerge($subsequentChange)) {
                    $change = $change->merge($subsequentChange);
                } else {
                    array_unshift($this->changes, $subsequentChange);
                }
            }

            $compressedChangeCollection->add($change);
        }

        return $compressedChangeCollection;
    }

    /**
     * Apply all changes
     *
     * @return void
     */
    public function apply()
    {
        while($change = array_shift($this->changes)) {
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
