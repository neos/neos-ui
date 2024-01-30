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

use Neos\ContentRepository\Core\ContentRepository;
use Neos\Flow\Mvc\Routing\UriBuilder;

/**
 * Retrieves the `nodeTree` and `structureTree` segments from
 * `Neos.Neos.userInterface.navigateComponent` settings,
 * `allowedTargetWorkspaces` from the ContentRepository's `WorkspaceService`
 * as well as the `nodeTypeSchema` and `translations` endpoints.
 *
 * @internal
 */
interface ConfigurationProviderInterface
{
    /**
     * @return array{nodeTree:mixed,structureTree:mixed,allowedTargetWorkspaces:mixed,endpoints:array{nodeTypeSchema:string,translations:string}}
     */
    public function getConfiguration(
        ContentRepository $contentRepository,
        UriBuilder $uriBuilder,
    ): array;
}
