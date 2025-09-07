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

namespace Neos\Neos\Ui\LinkEditor\Presentation\IconLabel;

use Neos\ContentRepository\Core\NodeType\NodeType;
use Neos\Flow\Annotations as Flow;

/**
 * @internal
 */
#[Flow\Scope("singleton")]
final class IconLabelFactory
{
    /** @param array<mixed> $nodeTreePreset */
    public function forNodeTreePreset(array $nodeTreePreset): IconLabel
    {
        return new IconLabel(
            icon: isset($nodeTreePreset['ui']['icon']) && is_string($nodeTreePreset['ui']['icon'])
                ? $nodeTreePreset['ui']['icon']
                : 'filter',
            label: isset($nodeTreePreset['ui']['label']) && is_string($nodeTreePreset['ui']['label'])
                ? $nodeTreePreset['ui']['label']
                : 'N/A',
        );
    }

    public function forNodeType(NodeType $nodeType): IconLabel
    {
        return new IconLabel(
            icon: $nodeType->getConfiguration('ui.icon') ?? 'questionmark',
            label: $nodeType->getConfiguration('ui.label') ?? 'N/A',
        );
    }
}
