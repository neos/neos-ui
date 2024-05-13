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

namespace Neos\Neos\Ui\Application\SyncWorkspace;

/**
 * @internal for communication within the Neos UI only
 */
enum TypeOfChange : int implements \JsonSerializable
{
    case NODE_HAS_BEEN_CREATED = 0b0001;
    case NODE_HAS_BEEN_CHANGED = 0b0010;
    case NODE_HAS_BEEN_MOVED = 0b0100;
    case NODE_HAS_BEEN_DELETED = 0b1000;

    public function jsonSerialize(): mixed
    {
        return $this->value;
    }
}
