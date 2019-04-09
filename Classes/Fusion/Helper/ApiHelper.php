<?php
namespace Neos\Neos\Ui\Fusion\Helper;

/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

use Neos\Eel\ProtectedContextAwareInterface;

class ApiHelper implements ProtectedContextAwareInterface
{
    /**
     * Converts an empty array to an empty object. Does nothing if array is not empty.
     *
     * Use this helper to prevent associative arrays from being converted to non-associative arrays by json_encode.
     *
     * @param array $array Associative array which may be empty
     * @return array|\stdClass Non-empty associative array or empty object
     */
    public function keepAssociative(array $array)
    {
        return $array === [] ? new \stdClass() : $array;
    }

    /**
     * @param string $methodName
     * @return bool
     */
    public function allowsCallOfMethod($methodName) : bool
    {
        return true;
    }
}
