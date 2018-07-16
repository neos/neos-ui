<?php
namespace Neos\Neos\Ui\Fusion;

/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

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
