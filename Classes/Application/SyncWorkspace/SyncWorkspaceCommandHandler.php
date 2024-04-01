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

use Neos\ContentRepository\Core\Feature\WorkspaceRebase\Exception\WorkspaceRebaseFailed;
use Neos\ContentRepositoryRegistry\ContentRepositoryRegistry;
use Neos\Flow\Annotations as Flow;
use Neos\Neos\Domain\Workspace\WorkspaceProvider;

/**
 * The application layer level command handler to for rebasing the workspace
 *
 * @internal for communication within the Neos UI only
 */
#[Flow\Scope("singleton")]
final class SyncWorkspaceCommandHandler
{
    #[Flow\Inject]
    protected ContentRepositoryRegistry $contentRepositoryRegistry;

    #[Flow\Inject]
    protected WorkspaceProvider $workspaceProvider;

    public function handle(SyncWorkspaceCommand $command): void
    {
        try {
            $workspace = $this->workspaceProvider->provideForWorkspaceName(
                $command->contentRepositoryId,
                $command->workspaceName
            );

            $workspace->rebase($command->rebaseErrorHandlingStrategy);
        } catch (WorkspaceRebaseFailed $e) {
            $conflictsBuilder = Conflicts::builder(
                contentRepository: $this->contentRepositoryRegistry
                    ->get($command->contentRepositoryId),
                workspaceName: $command->workspaceName,
                preferredDimensionSpacePoint: $command->preferredDimensionSpacePoint
            );

            foreach ($e->commandsThatFailedDuringRebase as $commandThatFailedDuringRebase) {
                $conflictsBuilder->addCommandThatFailedDuringRebase($commandThatFailedDuringRebase);
            }

            throw new ConflictsOccurred(
                $conflictsBuilder->build(),
                1712832228
            );
        }
    }
}
