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
use Neos\ContentRepository\Domain\Projection\Content\TraversableNodeInterface;
use Neos\Flow\Annotations as Flow;

#[Flow\Scope("singleton")]
final class OptionsDtoFactory
{
    #[Flow\Inject]
    protected OptionDtoFactory $optionDtoFactory;

    public function fromNodeForSelectedElement(NodeInterface $node): OptionsDto
    {
        $options = [$this->optionDtoFactory->fromNodeForSelectedElement($node)];

        /** @var TraversableNodeInterface $node */
        while ($node = $node->findParentNode()) {
            if ($node->isRoot()) break;

            /** @var NodeInterface $node */
            if ($node->getNodeType()->isOfType('Neos.Neos:Node')) {
                $options[] = $this->optionDtoFactory->fromNodeForSelectedElement($node);
            }
        }

        return new OptionsDto(...array_reverse($options));
    }
}
