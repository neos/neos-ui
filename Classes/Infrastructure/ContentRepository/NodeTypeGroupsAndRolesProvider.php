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

namespace Neos\Neos\Ui\Infrastructure\ContentRepository;

use Neos\Flow\Annotations as Flow;
use Neos\Neos\Ui\Domain\InitialData\NodeTypeGroupsAndRolesProviderInterface;

#[Flow\Scope("singleton")]
final class NodeTypeGroupsAndRolesProvider implements NodeTypeGroupsAndRolesProviderInterface
{
    /** @var array<mixed> */
    #[Flow\InjectConfiguration(path: 'nodeTypeRoles')]
    protected array $roles;

    /** @var array<mixed> */
    #[Flow\InjectConfiguration(path: 'nodeTypes.groups', package: 'Neos.Neos')]
    protected array $groups;

    public function getNodeTypes(): array
    {
        return [
            'roles' => $this->roles,
            'groups' => $this->groups,
        ];
    }
}
