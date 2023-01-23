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

#[Flow\Scope("singleton")]
final class PropertiesDtoFactory
{
    #[Flow\Inject(lazy: false)]
    protected PropertyDtoFactory $propertyDtoFactory;

    public function fromNode(NodeInterface $node): PropertiesDto
    {
        $propertyConfigurations = $node->getNodeType()->getConfiguration('properties') ?? [];
        $propertyDtos = [];

        foreach (array_keys($propertyConfigurations) as $propertyName) {
            $propertyDtos[] = $this->propertyDtoFactory->fromNodeForPropertyName($node, $propertyName);
        }

        return new PropertiesDto(...$propertyDtos);
    }
}
