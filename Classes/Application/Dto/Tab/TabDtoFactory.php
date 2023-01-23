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

namespace Neos\Neos\Ui\Application\Dto\Tab;

use Neos\ContentRepository\Domain\Model\NodeType;
use Neos\Flow\Annotations as Flow;
use Neos\Neos\Ui\Application\Dto\Group\GroupsDtoFactory;

#[Flow\Scope("singleton")]
final class TabDtoFactory
{
    #[Flow\Inject(lazy: false)]
    protected GroupsDtoFactory $groupsDtoFactory;

    public function fromNodeTypeForTabName(NodeType $nodeType, string $tabName): TabDto
    {
        $tabConfiguration = $nodeType->getConfiguration('ui.inspector.tabs.' . $tabName);

        return new TabDto(
            name: $tabName,
            position: $tabConfiguration['position'] ?? null,
            label: $tabConfiguration['label'],
            icon: $tabConfiguration['icon'],
            groups: $this->groupsDtoFactory->fromNodeTypeForTabName($nodeType, $tabName)
        );
    }
}
