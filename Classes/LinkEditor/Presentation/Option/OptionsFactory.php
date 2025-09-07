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

namespace Neos\Neos\Ui\LinkEditor\Presentation\Option;

use Neos\ContentRepository\Core\NodeType\NodeType;
use Neos\Flow\Annotations as Flow;

/**
 * @internal
 */
#[Flow\Scope("singleton")]
final class OptionsFactory
{
    public function __construct(
        private readonly OptionFactory $optionFactory,
    ) {
    }

    /** @param array<string,array<mixed>> $nodeTreePresets */
    public function forNodeTreePresets(array $nodeTreePresets): Options
    {
        $items = [];

        foreach ($nodeTreePresets as $presetName => $preset) {
            $items[] = $this->optionFactory->forNodeTreePreset($preset);
        }

        return new Options(...$items);
    }

    public function forNodeTypes(NodeType ...$nodeTypes): Options
    {
        return new Options(...array_map(
            fn (NodeType $nodeType) =>
                $this->optionFactory->forNodeType($nodeType),
            $nodeTypes,
        ));
    }
}
