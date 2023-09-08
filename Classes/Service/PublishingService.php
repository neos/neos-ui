<?php

/*
 * This file is part of the Neos.ContentRepository package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

declare(strict_types=1);

namespace Neos\Neos\Ui\Service;

use Neos\ContentRepository\Core\ContentRepository;
use Neos\ContentRepository\Core\Feature\WorkspacePublication\Command\PublishWorkspace;
use Neos\ContentRepository\Core\Feature\WorkspaceRebase\Command\RebaseWorkspace;
use Neos\ContentRepository\Core\SharedModel\Workspace\WorkspaceName;
use Neos\Flow\Annotations as Flow;

/**
 * A generic ContentRepository Publishing Service
 *
 * @api
 * @Flow\Scope("singleton")
 */
class PublishingService
{
    public function publishWorkspace(ContentRepository $contentRepository, WorkspaceName $workspaceName): void
    {
        // TODO: only rebase if necessary!
        $contentRepository->handle(
            RebaseWorkspace::create(
                $workspaceName
            )
        )->block();

        $contentRepository->handle(
            PublishWorkspace::create(
                $workspaceName
            )
        )->block();
    }
}
