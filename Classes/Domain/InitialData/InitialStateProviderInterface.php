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

namespace Neos\Neos\Ui\Domain\InitialData;

use Neos\ContentRepository\Core\SharedModel\ContentRepository\ContentRepositoryId;
use Neos\ContentRepository\Core\Projection\ContentGraph\Node;
use Neos\Flow\Mvc\ActionRequest;
use Neos\Neos\Domain\Model\User;

/**
 * Reads and preprocesses the `Neos.Neos.Ui.initialState` settings that are
 * used to hydrate the UI's redux store.
 *
 * @internal
 */
interface InitialStateProviderInterface
{
    /** @return array<mixed> */
    public function getInitialState(
        ActionRequest $actionRequest,
        ?Node $documentNode,
        ?Node $site,
    ): array;
}
