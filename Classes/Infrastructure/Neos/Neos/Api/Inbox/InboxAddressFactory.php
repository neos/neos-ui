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

namespace Neos\Neos\Ui\Infrastructure\Neos\Neos\Api\Inbox;

use Neos\Flow\Annotations as Flow;
use Neos\Neos\Domain\Model\User;
use Neos\Neos\Domain\Service\UserService;
use Neos\Neos\Utility\User as UserUtility;
use Neos\Neos\Ui\Framework\Api\Inbox\InboxAddress;

#[Flow\Scope("singleton")]
final class InboxAddressFactory
{
    #[Flow\Inject]
    protected UserService $userService;

    public function forNeosUser(User $user): InboxAddress
    {
        $userName = $this->userService->getUsername($user);
        $inboxName = UserUtility::getPersonalWorkspaceNameForUsername($userName);

        return InboxAddress::from($inboxName);
    }
}
