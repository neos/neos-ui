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

namespace Neos\Neos\Ui\Application\Dto\Editor;

use Neos\ContentRepository\Domain\Model\NodeType;
use Neos\Flow\Annotations as Flow;

#[Flow\Scope("singleton")]
final class EditorDtoFactory
{
    public function fromNodeTypeForPropertyName(NodeType $nodeType, string $propertyName): EditorDto
    {
        $propertyConfiguration = $nodeType->getConfiguration('properties.' . $propertyName);

        return new EditorDto(
            name: $propertyName,
            position: $propertyConfiguration['ui']['inspector']['position'] ?? null,
            label: $propertyConfiguration['ui']['label'] ?? null,
            editor: $propertyConfiguration['ui']['inspector']['editor'] ?? null,
            editorOptions: $propertyConfiguration['ui']['inspector']['editorOptions'] ?? null,
            helpMessage: $propertyConfiguration['ui']['inspector']['helpMessage'] ?? null,
            helpThumbnail: $propertyConfiguration['ui']['inspector']['helpThumbnail'] ?? null,
        );
    }
}
