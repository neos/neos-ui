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

namespace Neos\Neos\Ui\LinkEditor\Infrastructure\ESCR;

use Neos\ContentRepository\Core\NodeType\NodeType;
use Neos\ContentRepository\Core\NodeType\NodeTypeName;
use Neos\ContentRepository\Core\NodeType\NodeTypeNames;
use Neos\ContentRepository\Core\Projection\ContentGraph\Filter\NodeType\NodeTypeCriteria;
use Neos\ContentRepository\Core\Projection\ContentGraph\Node;
use Neos\Flow\Annotations as Flow;

/**
 * @internal
 */
#[Flow\Proxy(false)]
final class NodeTypeFilter
{
    public function __construct(
        public readonly NodeTypeCriteria $nodeTypeCriteria,
        private readonly NodeTypeNames $allowedNodeTypeNames,
    ) {
    }

    public function getAllowedNodeTypeNames(): NodeTypeNames
    {
        return $this->allowedNodeTypeNames;
    }

    public function toFilterString(): string
    {
        throw new \Exception(__METHOD__ . ' is not implemented yet!');
    }

    public function isSatisfiedByNode(Node $node): bool
    {
        return $this->isSatisfiedByNodeTypeName($node->nodeTypeName);
    }

    public function isSatisfiedByNodeType(NodeType $nodeType): bool
    {
        return $this->isSatisfiedByNodeTypeName($nodeType->name);
    }

    public function isSatisfiedByNodeTypeName(NodeTypeName $nodeTypeName): bool
    {
        // @TODO: This is VERY inefficient
        foreach ($this->allowedNodeTypeNames as $allowedNodeTypeName) {
            if ($nodeTypeName->equals($allowedNodeTypeName)) {
                return true;
            }
        }

        return false;
    }
}
