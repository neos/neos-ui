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

namespace Neos\Neos\Ui\Infrastructure\Neos;

use Neos\Flow\Annotations as Flow;
use Neos\Neos\Service\UserService;
use Neos\Neos\Ui\Domain\InitialData\UserProviderInterface;

/**
 * @internal
 */
#[Flow\Scope("singleton")]
final class UserProvider implements UserProviderInterface
{
    #[Flow\Inject]
    protected UserService $userService;

    /**
     * @return array{name:array{title:string,firstName:string,middleName:string,lastName:string,otherName:string,fullName:string},preferences:array{interfaceLanguage:null|string}}
     */
    public function getUser(): ?array
    {
        $user = $this->userService->getBackendUser();
        if ($user === null) {
            return null;
        }

        return [
            'name' => [
                'title' => $user->getName()->getTitle(),
                'firstName' => $user->getName()->getFirstName(),
                'middleName' => $user->getName()->getMiddleName(),
                'lastName' => $user->getName()->getLastName(),
                'otherName' => $user->getName()->getOtherName(),
                'fullName' => $user->getName()->getFullName(),
            ],
            'preferences' => [
                'interfaceLanguage' => $user->getPreferences()
                    ->getInterfaceLanguage(),
            ],
        ];
    }
}
