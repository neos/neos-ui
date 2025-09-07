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

namespace Neos\Neos\Ui\LinkEditor\Application\GetNodeTypeFilterOptions;

use Neos\Flow\Annotations as Flow;
use Neos\Neos\Ui\LinkEditor\Presentation\Option\Options;

/**
 * @internal
 */
#[Flow\Proxy(false)]
final class GetNodeTypeFilterOptionsQueryResult implements \JsonSerializable
{
    public function __construct(
        public readonly Options $options,
    ) {
    }

    public function jsonSerialize(): mixed
    {
        return get_object_vars($this);
    }
}
