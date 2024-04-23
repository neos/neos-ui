<?php

/*
 * This file is part of the Neos.Neos package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

declare(strict_types=1);

namespace Neos\Neos\Ui\Application\PublishChangesInDocument;

use Neos\ContentRepository\Core\Feature\WorkspaceRebase\Exception\WorkspaceRebaseFailed;
use Neos\ContentRepository\Core\SharedModel\Exception\NodeAggregateCurrentlyDoesNotExist;
use Neos\ContentRepository\Core\SharedModel\Exception\NodeAggregateDoesCurrentlyNotCoverDimensionSpacePoint;
use Neos\ContentRepositoryRegistry\ContentRepositoryRegistry;
use Neos\Flow\Annotations as Flow;
use Neos\Neos\Domain\NodeLabel\NodeLabelGeneratorInterface;
use Neos\Neos\Domain\Workspace\WorkspaceProvider;
use Neos\Neos\Ui\Application\Shared\ConflictsOccurred;
use Neos\Neos\Ui\Application\Shared\PublishSucceeded;
use Neos\Neos\Ui\Controller\TranslationTrait;
use Neos\Neos\Ui\Infrastructure\ContentRepository\ConflictsFactory;

/**
 * The application layer level command handler to perform publication of
 * all changes recorded for a given document
 *
 * @internal for communication within the Neos UI only
 */
#[Flow\Scope("singleton")]
final class PublishChangesInDocumentCommandHandler
{
    use TranslationTrait;

    #[Flow\Inject]
    protected ContentRepositoryRegistry $contentRepositoryRegistry;

    #[Flow\Inject]
    protected WorkspaceProvider $workspaceProvider;

    #[Flow\Inject]
    protected NodeLabelGeneratorInterface $nodeLabelGenerator;

    /**
     * @throws NodeAggregateCurrentlyDoesNotExist
     */
    public function handle(
        PublishChangesInDocumentCommand $command
    ): PublishSucceeded|ConflictsOccurred {
        try {
            $workspace = $this->workspaceProvider->provideForWorkspaceName(
                $command->contentRepositoryId,
                $command->workspaceName
            );
            $publishingResult = $workspace->publishChangesInDocument($command->documentId);

            return new PublishSucceeded(
                numberOfAffectedChanges: $publishingResult->numberOfPublishedChanges,
                baseWorkspaceName: $workspace->getCurrentBaseWorkspaceName()?->value
            );
        } catch (NodeAggregateCurrentlyDoesNotExist $e) {
            throw new \RuntimeException(
                $this->getLabel('NodeNotPublishedMissingParentNode'),
                1705053430,
                $e
            );
        } catch (NodeAggregateDoesCurrentlyNotCoverDimensionSpacePoint $e) {
            throw new \RuntimeException(
                $this->getLabel('NodeNotPublishedParentNodeNotInCurrentDimension'),
                1705053432,
                $e
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
