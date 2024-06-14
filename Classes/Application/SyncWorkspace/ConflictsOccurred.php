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
final class ConflictsOccurred extends \Exception
{
    public function __construct(
        public readonly Conflicts $conflicts,
        int $code
    ) {
        parent::__construct(
            sprintf('%s conflict(s) occurred during rebase.', count($conflicts)),
            $code
        );
    }
}
