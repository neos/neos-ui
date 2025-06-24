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

namespace Neos\Neos\Ui\Infrastructure\ESCR;

use Neos\Neos\PendingChangesProjection\Change;

readonly class NodeChangeState
{
    public function __construct(
        public bool $isCreated,
        public bool $isChanged,
        public bool $isDeleted,
    ) {
    }

    public static function create(): self
    {
        return new self(false, false, false);
    }

    public static function fromChange(Change $change): self
    {
        return new self(
            $change->created,
            $change->changed || $change->deleted,
            $change->deleted,
        );
    }

    public function withAppliedAdditionalChange(Change $change): self
    {
        return new self(
            $change->created || $this->isCreated,
            ($change->changed || $change->moved) || $this->isChanged,
            $change->deleted || $this->isDeleted,
        );
    }
}
