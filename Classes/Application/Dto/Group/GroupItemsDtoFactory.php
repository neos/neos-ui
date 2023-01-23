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
use Neos\Neos\Ui\Application\Dto\Editor\EditorDtoFactory;
use Neos\Neos\Ui\Application\Dto\View\ViewDto;
use Neos\Neos\Ui\Application\Dto\View\ViewDtoFactory;

#[Flow\Scope("singleton")]
final class GroupItemsDtoFactory
{
    #[Flow\Inject(lazy: false)]
    protected EditorDtoFactory $editorDtoFactory;

    #[Flow\Inject(lazy: false)]
    protected ViewDtoFactory $viewDtoFactory;

    public function fromNodeTypeForGroupName(NodeType $nodeType, string $groupName): GroupItemsDto
    {
        /** @var (PropertyDto|ViewDto)[] $groupItemDtos */
        $groupItemDtos = [];

        $propertyConfigurations = $nodeType->getConfiguration('properties') ?? [];

        foreach ($propertyConfigurations as $propertyName => $propertyConfiguration) {
            if (($propertyConfiguration['ui']['inspector']['group'] ?? null) === $groupName) {
                $groupItemDtos[] = $this->editorDtoFactory
                    ->fromNodeTypeForPropertyName($nodeType, $propertyName);
            }
        }

        $viewConfigurations = $nodeType->getConfiguration('ui.inspector.views') ?? [];

        foreach ($viewConfigurations as $viewName => $viewConfiguration) {
            if (($viewConfiguration['group'] ?? null) === $groupName) {
                $groupItemDtos[] = $this->viewDtoFactory
                    ->fromNodeTypeForViewName($nodeType, $viewName);
            }
        }

        return new GroupItemsDto(...$groupItemDtos);
    }
}
