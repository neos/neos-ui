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
use Neos\Neos\Ui\Framework\Api\Inbox\InboxAddress;
use Neos\Neos\Ui\Framework\Api\Inbox\InboxAddressProviderInterface;

#[Flow\Scope("singleton")]
final class InboxAddressProvider implements InboxAddressProviderInterface
{
    #[Flow\Inject]
    protected InboxAddressFactory $inboxAddressFactory;

    #[Flow\Inject]
    protected UserService $userService;

    public function getInboxAddressOfCurrentUser(): InboxAddress
    {
        $currentUser = $this->userService->getCurrentUser();

        return $this->inboxAddressFactory->forNeosUser($currentUser);
    }

    /**
     * @return \Traversable<InboxAddress>
     */
    public function getAllAvailableInboxAddresses(): \Traversable
    {
        foreach ($this->userService->getUsers() as $user) {
            /** @var User $user */
            if ($user->isActive()) {
                yield $this->inboxAddressFactory->forNeosUser($user);
            }
        }
    }
}
