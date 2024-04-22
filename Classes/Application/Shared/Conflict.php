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

use Neos\Flow\Annotations as Flow;

/**
 * A DTO representing a rebase conflict
 *
 * @internal for communication within the Neos UI only
 */
#[Flow\Proxy(false)]
final readonly class Conflict implements \JsonSerializable
{
    public function __construct(
        public ?IconLabel $affectedSite,
        public ?IconLabel $affectedDocument,
        public ?IconLabel $affectedNode,
        public ?TypeOfChange $typeOfChange,
        public ?ReasonForConflict $reasonForConflict
    ) {
    }

    public function jsonSerialize(): mixed
    {
        return get_object_vars($this);
    }
}
