<?php

/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

declare(strict_types=1);

namespace Neos\Neos\Ui\Application\Shared;

/**
 * @internal for communication within the Neos UI only
 */
enum ReasonForConflict : int implements \JsonSerializable
{
    case NODE_HAS_BEEN_DELETED = 0;

    public function jsonSerialize(): mixed
    {
        return $this->value;
    }
}
