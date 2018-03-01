<?php
namespace Neos\Neos\Ui\Domain\Service;

/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

use Neos\ContentRepository\Domain\Context\ContentStream\ContentStreamCommandHandler;
use Neos\ContentRepository\Domain\Projection\Workspace\WorkspaceFinder;
use Neos\EventSourcing\EventStore\EventStoreManager;
use Neos\Neos\Service\UserService;
use Neos\EventSourcing\EventStore\StreamNameFilter;
use Neos\ContentRepository\Domain\ValueObject\WorkspaceName;
use Neos\Flow\Annotations as Flow;

class CommandOverviewService
{
    /**
     * @Flow\Inject
     * @var UserService
     */
    protected $userService;

    /**
     * @Flow\Inject
     * @var EventStoreManager
     */
    protected $eventStoreManager;

    /**
     * @Flow\Inject
     * @var WorkspaceFinder
     */
    protected $workspaceFinder;

    public function getUnpublishedCommandsForCurrentWorkspace(): array
    {
        // Get the current workspace
        $personalWorkspaceName = $this->userService->getPersonalWorkspaceName();
        $workspace = $this->workspaceFinder->findOneByName(new WorkspaceName($personalWorkspaceName));

        // Get the workspaceContentStream
        $workspaceContentStreamName = ContentStreamCommandHandler::getStreamNameForContentStream($workspace->getCurrentContentStreamIdentifier());
        $eventStore = $this->eventStoreManager->getEventStoreForStreamName($workspaceContentStreamName);
        $workspaceContentStream = $eventStore->get(new StreamNameFilter($workspaceContentStreamName));

        // Build array to show in frontend
        $unpublishedCommands = [];

        foreach ($workspaceContentStream as $eventAndRawEvent) {
            $rawEvent = $eventAndRawEvent->getRawEvent();
            $identifier = $rawEvent->getSequenceNumber();
            $metadata = $rawEvent->getMetadata();
            if (isset($metadata['commandClass'])) {
                $unpublishedCommands[$identifier]['type'] = $rawEvent->gettype();
                $unpublishedCommands[$identifier]['commandClass'] = $metadata['commandClass'];
                $unpublishedCommands[$identifier]['payload'] = $metadata['commandPayload'];
            }
        }

        return $unpublishedCommands;
    }
}

