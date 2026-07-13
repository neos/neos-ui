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

#[Flow\Proxy(false)]
final readonly class CreateUserCommand
{
    /**
     * @param list<string> $roles
     */
    public function __construct(
        public string $name,
        public string $password,
        public array $roles,
    ) {
    }

    /** @param array<int|string,mixed> $array */
    public static function fromArray(array $array): self
    {
        return new self(
            name: $array['name'],
            password: $array['password'],
            roles: $array['roles'],
        );
    }
}
