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

namespace Neos\Neos\Ui\Application\Dto\Property;

use Neos\ContentRepository\Domain\Model\NodeInterface;
use Neos\Flow\Annotations as Flow;
use Neos\Neos\Service\Mapping\NodePropertyConverterService;

#[Flow\Scope("singleton")]
final class PropertyDtoFactory
{
    #[Flow\Inject]
    protected NodePropertyConverterService $nodePropertyConversionService;

    public function fromNodeForPropertyName(NodeInterface $node, string $propertyName): PropertyDto
    {
        return new PropertyDto(
            name: $propertyName,
            value: $this->nodePropertyConversionService->getProperty($node, $propertyName)
        );
    }
}
