<?php
namespace PackageFactory\Guevara\TypoScript;

use TYPO3\Flow\Annotations as Flow;
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
        $collection = $this->getCollection();

        $output = [];
        if ($collection === null) {
            return [];
        }
        $this->numberOfRenderedNodes = 0;
        $itemName = $this->getItemName();
        if ($itemName === null) {
            throw new \TYPO3\TypoScript\Exception('The Collection needs an itemName to be set.', 1344325771);
        }
        $iterationName = $this->getIterationName();
        $collectionTotalCount = count($collection);
        foreach ($collection as $collectionElement) {
            $context = $this->tsRuntime->getCurrentContext();
            $context[$itemName] = $collectionElement;
            if ($iterationName !== null) {
                $context[$iterationName] = $this->prepareIterationInformation($collectionTotalCount);
            }

            $this->tsRuntime->pushContextArray($context);
            if ($value = $this->tsRuntime->render($this->path . '/itemRenderer')) {
                if ($this->tsRuntime->canRender($this->path . '/itemKey')) {
                    $key = $this->tsRuntime->render($this->path . '/itemKey');
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
