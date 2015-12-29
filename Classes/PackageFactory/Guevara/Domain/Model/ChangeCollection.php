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
     * @var \SplQueue
     */
    protected $changes;

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->changes = new \SplQueue();
    }

    /**
     * Add a change to this collection
     *
     * @param ChangeInterface $change
     * @return void
     */
    public function add(ChangeInterface $change)
    {
        $this->changes->enqeue($change);
    }

    /**
     * Reduce this collection to a minimal set of changes with the same outcome
     *
     * @return ChangeCollection
     */
    public function compress()
    {
        $compressedChangeCollection = new ChangeCollection();

        while($change = $this->changes->dequeue()) {
            if ($subsequentChange = $this->changes->dequeue()) {
                if ($change->canMerge($subsequentChange)) {
                    $change = $change->merge($subsequentChange);
                } else {
                    $this->changes->unshift($subsequentChange);
                }
            }

            $compressedChangeCollection->add($change);
        }

        return $compressedChangeCollection;
    }

}
