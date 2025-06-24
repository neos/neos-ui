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

namespace Neos\Neos\Ui\Application\Shared;

use Neos\ContentRepository\Core\SharedModel\Node\NodeAddress;
use Neos\Flow\Annotations as Flow;

/**
 * @internal
 */
#[Flow\Proxy(false)]
final class TreeNode implements \JsonSerializable
{
    public function __construct(
        public readonly NodeAddress $nodeAddress,
        public readonly string $icon,
        public readonly string $label,
        public readonly string $nodeTypeLabel,
        public readonly bool $isMatchedByFilter,
        public readonly bool $isDisabled,
        public readonly bool $isHiddenInMenu,
        public readonly bool $isCreated,
        public readonly bool $isModified,
        public readonly bool $isRemoved,
        // todo rename to hasTimeableNodeVisibility?
        public readonly bool $hasScheduledDisabledState,
        public readonly bool $hasUnloadedChildren,
        public readonly TreeNodes $children
    ) {
    }

    public function jsonSerialize(): mixed
    {
        return [
            'nodeAddress' => $this->nodeAddress->toJson(),
            'icon' => $this->icon,
            'label' => $this->label,
            'nodeTypeLabel' => $this->nodeTypeLabel,
            'isMatchedByFilter' => $this->isMatchedByFilter,
            'isDisabled' => $this->isDisabled,
            'isHiddenInMenu' => $this->isHiddenInMenu,
            'isCreated' => $this->isCreated,
            'isModified' => $this->isModified,
            'isRemoved' => $this->isRemoved,
            'hasScheduledDisabledState' => $this->hasScheduledDisabledState,
            'hasUnloadedChildren' => $this->hasUnloadedChildren,
            'children' => $this->children,
        ];
    }
}
