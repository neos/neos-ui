<?php
namespace Neos\Neos\Ui\TypoScript;

use Neos\Flow\Annotations as Flow;
use TYPO3\TypoScript\Exception as TypoScriptException;

/**
 * Implementation of an array collection renderer for TypoScript.
 */
class AppendAllToCollectionImplementation extends ArrayCollectionImplementation
{
    public function getCollection()
    {
        return $this->tsValue('items');
    }

    /**
     * Evaluate the collection nodes
     *
     * @return string
     * @throws TypoScriptException
     */
    public function evaluate()
    {
        $items = parent::evaluate();
        $collection = $this->tsValue('appendTo');

        return array_merge($collection, $items);
    }
}
