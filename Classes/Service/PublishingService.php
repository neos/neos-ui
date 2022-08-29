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
use Neos\ContentRepository\Core\Feature\WorkspaceCommandHandler;
use Neos\ContentRepository\Core\SharedModel\User\UserIdentifier;
use Neos\ContentRepository\Core\SharedModel\Workspace\WorkspaceName;
use Neos\ContentRepository\Core\Factory\ContentRepositoryIdentifier;
use Neos\Flow\Annotations as Flow;
use Neos\Flow\Persistence\PersistenceManagerInterface;
use Neos\Neos\Domain\Model\User;
use Neos\Neos\Service\UserService;

/**
 * A generic ContentRepository Publishing Service
 *
 * @api
 * @Flow\Scope("singleton")
 */
class PublishingService
{
    /**
     * @Flow\Inject
     * @var PersistenceManagerInterface
     */
    protected $persistenceManager;

    /**
     * @Flow\Inject
     * @var UserService
     */
    protected $userService;

    public function publishWorkspace(ContentRepository $contentRepository, WorkspaceName $workspaceName): void
    {
        /** @var User $backendUser */
        $backendUser = $this->userService->getBackendUser();
        $userIdentifier = UserIdentifier::fromString(
            $this->persistenceManager->getIdentifierByObject($backendUser)
        );

        // TODO: only rebase if necessary!
        $contentRepository->handle(
            RebaseWorkspace::create(
                $workspaceName,
                $userIdentifier
            )
        )->block();

        $contentRepository->handle(
            new PublishWorkspace(
                $workspaceName,
                $userIdentifier
            )
        )->block();
    }
}
