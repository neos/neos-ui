<?php
namespace Neos\Neos\Ui\TypoScript;

use Neos\Flow\Annotations as Flow;
use Neos\Fusion\TypoScriptObjects\AbstractTypoScriptObject;

class AppendToCollectionImplementation extends AbstractTypoScriptObject
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
