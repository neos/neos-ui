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

namespace Neos\Neos\Ui\Application\Dto\Tab;

use Neos\ContentRepository\Domain\Model\NodeType;
use Neos\Flow\Annotations as Flow;

#[Flow\Scope("singleton")]
final class TabsDtoFactory
{
    #[Flow\Inject(lazy: false)]
    protected TabDtoFactory $tabDtoFactory;

    public function fromNodeType(NodeType $nodeType): TabsDto
    {
        $tabConfigurations = $nodeType->getConfiguration('ui.inspector.tabs') ?? [];
        $tabDtos = [];

        foreach (array_keys($tabConfigurations) as $tabName) {
            $tabDto = $this->tabDtoFactory->fromNodeTypeForTabName($nodeType, $tabName);

            if (count($tabDto->groups)) {
                $tabDtos[] = $tabDto;
            }
        }

        return new TabsDto(...$tabDtos);
    }
}
