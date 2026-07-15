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

namespace Neos\TestNodeTypes\Application\RemoveAllUsers;

use Neos\EventStore\Exception\ConcurrencyException;
use Neos\Flow\Annotations as Flow;
use Neos\Flow\Security\Context;
use Neos\Neos\Domain\Model\User;
use Neos\Neos\Domain\Repository\WorkspaceMetadataAndRoleRepository;
use Neos\Neos\Domain\Service\UserService;
use Neos\Neos\Domain\Service\WorkspaceService;

#[Flow\Scope("singleton")]
final class RemoveAllUsersCommandHandler
{
    #[Flow\Inject]
    protected UserService $userService;

    #[Flow\Inject]
    protected WorkspaceMetadataAndRoleRepository $workspaceMetadataAndRoleRepository;

    #[Flow\Inject]
    protected WorkspaceService $workspaceService;

    #[Flow\Inject]
    protected Context $context;

    public function handle(RemoveAllUsersCommand $command): void
    {
        /** @var User $user */
        foreach ($this->userService->getUsers() as $user) {
            foreach ($user->getAccounts() as $account) {
                if (str_starts_with($account->getAccountIdentifier(), $command->prefix)) {
                    // FIXME in Neos Core user deletion should not fail due to security after most of the job is already done? Possibly always allow deletion?
                    $this->context->withoutAuthorizationChecks(
                        function () use ($user) {
                            // FIXME backoff in Neos Core
                            foreach ($this->workspaceMetadataAndRoleRepository->findAllPersonalWorkspaceNamesByUser($user->getId()) as $contentRepositoryId => $workspaceName) {
                                $lastConcurrencyException = null;
                                # Exponential backoff: initial interval = 5ms and 8 retry attempts = max 1275ms (= 1,275 seconds)
                                # @see http://backoffcalculator.com/?attempts=8&rate=2&interval=5
                                $retryWaitInterval = 0.005;
                                $maxRetryAttempts = 8;
                                for ($retryAttempt = 0; $retryAttempt < $maxRetryAttempts; $retryAttempt++) {
                                    try {
                                        // we delete the workspace WITH possible pending changes
                                        $this->workspaceService->deleteWorkspace($contentRepositoryId, $workspaceName);
                                        continue 2;
                                    } catch (ConcurrencyException $concurrencyException) {
                                        $lastConcurrencyException = $concurrencyException;
                                        usleep((int)($retryWaitInterval * 1E6));
                                        $retryWaitInterval *= 2;
                                        continue;
                                    }
                                }
                                throw new \RuntimeException(sprintf('Could not delete workspace %s in content repository %s for user %s after %d retry attempts', $workspaceName->value, $contentRepositoryId->value, $user->getId()->value, $retryAttempt), 1784121551, $lastConcurrencyException);
                            }

                            return $this->userService->deleteUser($user);
                        }
                    );
                    continue 2;
                }
            }
        }
    }
}
