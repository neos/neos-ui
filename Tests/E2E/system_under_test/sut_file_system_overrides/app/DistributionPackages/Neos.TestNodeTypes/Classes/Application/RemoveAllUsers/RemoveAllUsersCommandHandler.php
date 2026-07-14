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

use Neos\Flow\Annotations as Flow;
use Neos\Flow\Security\Context;
use Neos\Neos\Domain\Model\User;
use Neos\Neos\Domain\Service\UserService;

#[Flow\Scope("singleton")]
final class RemoveAllUsersCommandHandler
{
    #[Flow\Inject]
    protected UserService $userService;

    #[Flow\Inject]
    protected Context $context;

    public function handle(RemoveAllUsersCommand $command): void
    {
        /** @var User $user */
        foreach ($this->userService->getUsers() as $user) {
            foreach ($user->getAccounts() as $account) {
                if (str_starts_with($account->getAccountIdentifier(), $command->prefix)) {
                    $this->context->withoutAuthorizationChecks(
                        fn () => $this->userService->deleteUser($user)
                    );
                    continue 2;
                }
            }
        }
    }
}
