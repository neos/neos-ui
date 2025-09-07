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

use Neos\ContentRepository\Core\NodeType\NodeTypeName;
use Neos\ContentRepository\Core\SharedModel\ContentRepository\ContentRepositoryId;
use Neos\Flow\Annotations as Flow;

/**
 * @internal
 */
#[Flow\Proxy(false)]
final class NodeTypeWasNotFound extends \Exception
{
    private function __construct(string $message, int $code)
    {
        parent::__construct($message, $code);
    }

    public static function becauseNodeTypeWithGivenNameDoesNotExistInCurrentSchema(
        NodeTypeName $nodeTypeName,
        ContentRepositoryId $contentRepositoryId,
    ): self {
        return new self(
            sprintf(
                'A node type with the name "%s" does not exist in schema of content repository "%s".',
                $nodeTypeName->value,
                $contentRepositoryId->value,
            ),
            1721047345
        );
    }
}
