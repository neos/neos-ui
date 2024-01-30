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

use Neos\ContentRepository\Core\Factory\ContentRepositoryId;
use Neos\ContentRepository\Core\Projection\ContentGraph\Node;
use Neos\Flow\Mvc\Controller\ControllerContext;
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
        ControllerContext $controllerContext,
        ContentRepositoryId $contentRepositoryId,
        ?Node $documentNode,
        ?Node $site,
        User $user,
    ): array;
}
