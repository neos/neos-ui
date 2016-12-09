<?php
namespace Neos\Neos\Ui\Fusion;

use Neos\Flow\Annotations as Flow;
use Neos\Fusion\FusionObjects\AbstractFusionObject;

class AppendToCollectionImplementation extends AbstractFusionObject
{
    /**
     * Appends an item to the given collection
     *
     * @return string
     */
    public function evaluate()
    {
        $collection = $this->tsValue('collection');
        $key = $this->tsValue('key');
        $item = $this->tsValue('item');

        if ($key) {
            $collection[$key] = $item;
        } else {
            $collection[] = $item;
        }

        return $collection;
    }
}
