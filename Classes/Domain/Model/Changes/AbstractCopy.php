<?php
namespace Neos\Neos\Ui\Domain\Model\Changes;

/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

use Neos\ContentRepository\Domain\Model\NodeInterface;
use Neos\ContentRepository\Domain\Service as ContentRepository;
use Neos\Flow\Annotations as Flow;

abstract class AbstractCopy extends AbstractStructuralChange
{
    /**
     * @Flow\Inject
     * @var ContentRepository\NodeServiceInterface
     */
    protected $contentRepositoryNodeService;

    /**
     * Generate a unique node name for the copied node
     *
     * @param NodeInterface $parentNode
     * @return string
     */
    protected function generateUniqueNodeName(NodeInterface $parentNode)
    {
        return $this->contentRepositoryNodeService
            ->generateUniqueNodeName($parentNode->getPath());
    }
}
