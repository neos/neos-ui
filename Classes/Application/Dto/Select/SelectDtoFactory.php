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

namespace Neos\Neos\Ui\Application\Dto\Select;

use Neos\ContentRepository\Domain\Model\NodeInterface;
use Neos\Flow\Annotations as Flow;

#[Flow\Scope("singleton")]
final class SelectDtoFactory
{
    #[Flow\Inject]
    protected OptionsDtoFactory $optionsDtoFactory;

    public function fromNodeForSelectedElement(NodeInterface $node): SelectDto
    {
        return new SelectDto(
            value: $node->getContextPath(),
            options: $this->optionsDtoFactory->fromNodeForSelectedElement($node)
        );
    }
}
