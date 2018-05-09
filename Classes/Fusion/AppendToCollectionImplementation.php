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
        $collection = $this->fusionValue('collection');
        $key = $this->fusionValue('key');
        $item = $this->fusionValue('item');

        if ($key) {
            $collection[$key] = $item;
        } else {
            $collection[] = $item;
        }

        return $collection;
    }
}
