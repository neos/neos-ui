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

use Neos\ContentRepository\Core\Feature\WorkspaceRebase\Exception\WorkspaceRebaseFailed;
use Neos\ContentRepositoryRegistry\ContentRepositoryRegistry;
use Neos\Flow\Annotations as Flow;
use Neos\Neos\Domain\NodeLabel\NodeLabelGeneratorInterface;
use Neos\Neos\Domain\Service\WorkspacePublishingService;
use Neos\Neos\Ui\Application\Shared\ConflictsOccurred;
use Neos\Neos\Ui\Application\Shared\PublishSucceeded;
use Neos\Neos\Ui\Infrastructure\ContentRepository\ConflictsFactory;

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
    protected ContentRepositoryRegistry $contentRepositoryRegistry;

    #[Flow\Inject]
    protected WorkspacePublishingService $workspacePublishingService;

    #[Flow\Inject]
    protected NodeLabelGeneratorInterface $nodeLabelGenerator;

    public function handle(
        PublishChangesInSiteCommand $command
    ): PublishSucceeded|ConflictsOccurred {
        try {
            $publishingResult = $this->workspacePublishingService->publishChangesInSite(
                $command->contentRepositoryId,
                $command->workspaceName,
                $command->siteId
            );

            $workspace = $this->contentRepositoryRegistry->get($command->contentRepositoryId)->findWorkspaceByName(
                $command->workspaceName
            );

            return new PublishSucceeded(
                numberOfAffectedChanges: $publishingResult->numberOfPublishedChanges,
                baseWorkspaceName: $workspace?->baseWorkspaceName?->value
            );
        } catch (WorkspaceRebaseFailed $e) {
            $conflictsFactory = new ConflictsFactory(
                contentRepository: $this->contentRepositoryRegistry
                    ->get($command->contentRepositoryId),
                nodeLabelGenerator: $this->nodeLabelGenerator,
                workspaceName: $command->workspaceName,
                preferredDimensionSpacePoint: $command->preferredDimensionSpacePoint
            );

            return new ConflictsOccurred(
                conflicts: $conflictsFactory->fromWorkspaceRebaseFailed($e)
            );
        }
    }
}
