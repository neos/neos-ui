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

namespace Neos\Neos\Ui\LinkEditor\Application\Shared;

use Neos\ContentRepository\Core\SharedModel\Node\NodeAggregateId;
use Neos\Flow\Annotations as Flow;

/**
 * @internal
 */
#[Flow\Proxy(false)]
final class TreeNodeBuilder
{
    /** @var array<string,TreeNodeBuilder> */
    private array $childrenByIdentifier = [];

    /** @var list<TreeNodeBuilder> $children */
    private array $children = [];

    public function __construct(
        private readonly NodeAggregateId $nodeAggregateId,
        private readonly string $icon,
        private readonly string $label,
        private readonly string $nodeTypeLabel,
        private bool $isMatchedByFilter,
        private bool $isLinkable,
        private readonly bool $isDisabled,
        private readonly bool $isHiddenInMenu,
        private readonly bool $hasScheduledDisabledState,
        private bool $hasUnloadedChildren,
    ) {
    }

    public function containsNodeTreeByNodeAggregateId(NodeAggregateId $nodeAggregateId): bool
    {
        if ($this->nodeAggregateId->equals($nodeAggregateId)) {
            return true;
        }
        foreach ($this->children as $child) {
            if ($child->containsNodeTreeByNodeAggregateId($nodeAggregateId)) {
                return true;
            }
        }
        return false;
    }

    public function setIsMatchedByFilter(bool $value): self
    {
        $this->isMatchedByFilter = $value;
        return $this;
    }

    public function setIsLinkable(bool $value): self
    {
        $this->isLinkable = $value;
        return $this;
    }

    public function setHasUnloadedChildren(bool $value): self
    {
        $this->hasUnloadedChildren = $value;
        return $this;
    }

    public function addChild(TreeNodeBuilder $childBuilder): self
    {
        if (!isset($this->childrenByIdentifier[$childBuilder->nodeAggregateId->value])) {
            $this->children[] = $childBuilder;
            $this->childrenByIdentifier[$childBuilder->nodeAggregateId->value] = $childBuilder;
        }

        return $this;
    }

    public function build(): TreeNode
    {
        return new TreeNode(
            nodeAggregateIdentifier: $this->nodeAggregateId,
            icon: $this->icon,
            label: $this->label,
            nodeTypeLabel: $this->nodeTypeLabel,
            isMatchedByFilter: $this->isMatchedByFilter,
            isLinkable: $this->isLinkable,
            isDisabled: $this->isDisabled,
            isHiddenInMenu: $this->isHiddenInMenu,
            hasScheduledDisabledState: $this->hasScheduledDisabledState,
            hasUnloadedChildren: $this->hasUnloadedChildren,
            children: $this->buildChildren(),
        );
    }

    private function buildChildren(): TreeNodes
    {
        $items = [];

        foreach ($this->children as $childBuilder) {
            $items[] = $childBuilder->build();
        }

        return new TreeNodes(...$items);
    }
}
