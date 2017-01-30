<?php
namespace Neos\Neos\Ui\Fusion;

use Neos\Flow\Annotations as Flow;
use Neos\Fusion\Exception as FusionException;

/**
 * Implementation of an array collection renderer for Fusion.
 */
class AppendAllToCollectionImplementation extends ArrayCollectionImplementation
{
    public function getCollection()
    {
        return $this->fusionValue('items');
    }

    /**
     * Evaluate the collection nodes
     *
     * @return string
     * @throws FusionException
     */
    public function evaluate()
    {
        $items = parent::evaluate();
        $collection = $this->fusionValue('appendTo');

        return array_merge($collection, $items);
    }
}
