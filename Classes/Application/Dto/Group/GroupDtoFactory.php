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

namespace Neos\Neos\Ui\Application\Dto\Group;

use Neos\ContentRepository\Domain\Model\NodeType;
use Neos\Flow\Annotations as Flow;

#[Flow\Scope("singleton")]
final class GroupDtoFactory
{
    #[Flow\Inject(lazy: false)]
    protected GroupItemsDtoFactory $groupItemsDtoFactory;

    public function fromNodeTypeForGroupName(NodeType $nodeType, string $groupName): GroupDto
    {
        $groupConfiguration = $nodeType->getConfiguration('ui.inspector.groups.' . $groupName);

        return new GroupDto(
            name: $groupName,
            position: $groupConfiguration['position'] ?? null,
            label: $groupConfiguration['label'],
            icon: $groupConfiguration['icon'] ?? 'questionmark',
            items: $this->groupItemsDtoFactory->fromNodeTypeForGroupName($nodeType, $groupName)
        );
    }
}
