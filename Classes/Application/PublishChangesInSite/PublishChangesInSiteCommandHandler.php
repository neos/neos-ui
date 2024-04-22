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

namespace Neos\Neos\Ui\Application\PublishChangesInSite;

use Neos\Flow\Annotations as Flow;
use Neos\Neos\Domain\Workspace\WorkspaceProvider;
use Neos\Neos\Ui\Application\Shared\PublishSucceeded;

/**
 * The application layer level command handler to perform publication of
 * all changes recorded for a given site
 *
 * @internal for communication within the Neos UI only
 */
#[Flow\Scope("singleton")]
final class PublishChangesInSiteCommandHandler
{
    #[Flow\Inject]
    protected WorkspaceProvider $workspaceProvider;

    public function handle(PublishChangesInSiteCommand $command): PublishSucceeded
    {
        $workspace = $this->workspaceProvider->provideForWorkspaceName(
            $command->contentRepositoryId,
            $command->workspaceName
        );
        $publishingResult = $workspace->publishChangesInSite($command->siteId);

        return new PublishSucceeded(
            numberOfAffectedChanges: $publishingResult->numberOfPublishedChanges,
            baseWorkspaceName: $workspace->getCurrentBaseWorkspaceName()?->value
        );
    }
}
