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

use Neos\ContentRepository\Core\Projection\ContentGraph\Node;
use Neos\Flow\Annotations as Flow;

/**
 * @internal
 */
#[Flow\Proxy(false)]
final class LinkableNodeSpecification
{
    public function __construct(
        public readonly NodeTypeFilter $linkableNodeTypes,
    ) {
    }

    public function isSatisfiedByNode(Node $node): bool
    {
        return $this->linkableNodeTypes->isSatisfiedByNode($node);
    }
}
