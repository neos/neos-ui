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

namespace Neos\Neos\Ui\Application\Dto\View;

use Neos\ContentRepository\Domain\Model\NodeType;
use Neos\Flow\Annotations as Flow;

#[Flow\Scope("singleton")]
final class ViewDtoFactory
{
    public function fromNodeTypeForViewName(NodeType $nodeType, string $viewName): ViewDto
    {
        $viewConfiguration = $nodeType->getConfiguration('ui.inspector.views.' . $viewName);

        return new ViewDto(
            name: $viewName,
            position: $viewConfiguration['position'] ?? null,
            label: $viewConfiguration['label'] ?? null,
            view: $viewConfiguration['view'],
            viewOptions: $viewConfiguration['viewOptions'] ?? null
        );
    }
}
