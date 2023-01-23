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
final class GroupsDtoFactory
{
    #[Flow\Inject(lazy: false)]
    protected GroupDtoFactory $groupDtoFactory;

    public function fromNodeTypeForTabName(NodeType $nodeType, string $tabName): GroupsDto
    {
        $groupConfigurations = $nodeType->getConfiguration('ui.inspector.groups') ?? [];
        $groupDtos = [];

        foreach ($groupConfigurations as $groupName => $groupConfiguration) {
            if (($groupConfiguration['tab'] ?? 'default') === $tabName) {
                $groupDto = $this->groupDtoFactory->fromNodeTypeForGroupName($nodeType, $groupName);

                if (count($groupDto->items)) {
                    $groupDtos[] = $groupDto;
                }
            }
        }

        return new GroupsDto(...$groupDtos);
    }
}
