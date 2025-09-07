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
use Neos\Utility\Unicode\Functions as UnicodeFunctions;

/**
 * @internal
 */
#[Flow\Proxy(false)]
final class NodeSearchSpecification
{
    public function __construct(
        public readonly NodeTypeFilter $baseNodeTypeFilter,
        public readonly ?NodeTypeFilter $narrowNodeTypeFilter,
        public readonly ?string $searchTerm,
        private readonly NodeService $nodeService,
    ) {
    }

    public function isSatisfiedByNode(Node $node): bool
    {
        if (!$this->baseNodeTypeFilter->isSatisfiedByNode($node)) {
            return false;
        }

        if ($this->narrowNodeTypeFilter && !$this->narrowNodeTypeFilter->isSatisfiedByNode($node)) {
            return false;
        }

        if (!$this->nodeContainsSearchTerm($node)) {
            return false;
        }

        return true;
    }

    private function nodeContainsSearchTerm(Node $node): bool
    {
        if ($this->searchTerm === null) {
            return true;
        }

        $term = json_encode(UnicodeFunctions::strtolower($this->searchTerm), JSON_UNESCAPED_UNICODE);
        $term = trim($term ? $term : '', '"');

        $label = $this->nodeService->getLabelForNode($node);

        /** @var int|false $positionOfTermInLabel */
        $positionOfTermInLabel = UnicodeFunctions::strpos(
            UnicodeFunctions::strtolower($label),
            $term
        );

        if ($positionOfTermInLabel !== false) {
            // Term matches label
            return true;
        }

        $properties = json_encode(
            $node->properties->serialized(),
            JSON_THROW_ON_ERROR | JSON_PRETTY_PRINT | JSON_FORCE_OBJECT | JSON_UNESCAPED_UNICODE
        );

        return UnicodeFunctions::strpos($properties, $term) !== false;
    }
}
