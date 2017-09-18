<?php
namespace Neos\Neos\Ui\Fusion;

use Neos\Flow\Annotations as Flow;
use Neos\Fusion\Exception as FusionException;
use Neos\Fusion\FusionObjects\AbstractCollectionImplementation;

/**
 * Implementation of an array collection renderer for Fusion.
 */
class ArrayCollectionImplementation extends AbstractCollectionImplementation
{
    /**
     * Evaluate the collection nodes
     *
     * @return string|array
     * @throws FusionException
     */
    public function evaluate()
    {
        $collection = $this->fusionValue('collection');

        $output = [];
        if ($collection === null) {
            return [];
        }
        $this->numberOfRenderedNodes = 0;
        $itemName = $this->getItemName();
        $itemKey = $this->fusionValue('itemKey');
        if ($itemName === null) {
            throw new FusionException('The Collection needs an itemName to be set.', 1344325771);
        }
        $iterationName = $this->getIterationName();
        $collectionTotalCount = count($collection);
        foreach ($collection as $collectionElementKey => $collectionElement) {
            $context = $this->runtime->getCurrentContext();
            $context[$itemKey] = $collectionElementKey;
            $context[$itemName] = $collectionElement;
            if ($iterationName !== null) {
                $context[$iterationName] = $this->prepareIterationInformation($collectionTotalCount);
            }

            $this->runtime->pushContextArray($context);
            if ($value = $this->runtime->render($this->path . '/itemRenderer')) {
                if ($this->runtime->canRender($this->path . '/itemKeyRenderer')) {
                    $key = $this->runtime->render($this->path . '/itemKeyRenderer');
                    $output[$key] = $value;
                } else {
                    $output[] = $value;
                }
            }
            $this->runtime->popContext();
            $this->numberOfRenderedNodes++;
        }

        return $output;
    }
}
