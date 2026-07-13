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

namespace Neos\TestNodeTypes\Application\CreateUser;

use Neos\Flow\Annotations as Flow;
use Neos\Neos\Domain\Service\UserService;

#[Flow\Scope("singleton")]
final class CreateUserCommandHandler
{
    #[Flow\Inject]
    protected UserService $userService;

    public function handle(CreateUserCommand $command): void
    {
        $this->userService->createUser(
            username: sprintf('test-%s', $command->name),
            password: $command->password,
            firstName: sprintf('First%s', ucfirst($command->name)),
            lastName: sprintf('Last%s', ucfirst($command->name)),
            roleIdentifiers: $command->roles
        );
    }
}
