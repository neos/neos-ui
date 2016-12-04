<?php
namespace Neos\Neos\Ui\TypoScript;

use Neos\Flow\Annotations as Flow;
use TYPO3\TypoScript\Exception as TypoScriptException;
use TYPO3\TypoScript\TypoScriptObjects\AbstractCollectionImplementation;

/**
 * Implementation of an array collection renderer for TypoScript.
 */
class ArrayCollectionImplementation extends AbstractCollectionImplementation
{
    /**
     * Evaluate the collection nodes
     *
     * @return string
     * @throws TypoScriptException
     */
    public function evaluate()
    {
        $collection = $this->tsValue('collection');

        $output = [];
        if ($collection === null) {
            return [];
        }
        $this->numberOfRenderedNodes = 0;
        $itemName = $this->getItemName();
        $itemKey = $this->tsValue('itemKey');
        if ($itemName === null) {
            throw new \TYPO3\TypoScript\Exception('The Collection needs an itemName to be set.', 1344325771);
        }
        $iterationName = $this->getIterationName();
        $collectionTotalCount = count($collection);
        foreach ($collection as $collectionElementKey => $collectionElement) {
            $context = $this->tsRuntime->getCurrentContext();
            $context[$itemKey] = $collectionElementKey;
            $context[$itemName] = $collectionElement;
            if ($iterationName !== null) {
                $context[$iterationName] = $this->prepareIterationInformation($collectionTotalCount);
            }

            $this->tsRuntime->pushContextArray($context);
            if ($value = $this->tsRuntime->render($this->path . '/itemRenderer')) {
                if ($this->tsRuntime->canRender($this->path . '/itemKeyRenderer')) {
                    $key = $this->tsRuntime->render($this->path . '/itemKeyRenderer');
                    $output[$key] = $value;
                } else {
                    $output[] = $value;
                }
            }
            $this->tsRuntime->popContext();
            $this->numberOfRenderedNodes++;
        }

        return $output;
    }
}
