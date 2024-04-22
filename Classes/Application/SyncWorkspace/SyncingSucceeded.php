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

use Neos\Flow\Annotations as Flow;

/**
 * The application layer level result DTO to signal that a rebase operation
 * has succeeded
 *
 * @internal for communication within the Neos UI only
 */
#[Flow\Proxy(false)]
final readonly class SyncingSucceeded implements \JsonSerializable
{
    public function jsonSerialize(): mixed
    {
        return ['success' => true];
    }
}
