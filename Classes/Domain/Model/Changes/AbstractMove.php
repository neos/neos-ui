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

use Neos\ContentRepository\Domain\Model\Node;
use Neos\ContentRepository\Domain\Model\NodeInterface;
use Neos\ContentRepository\Domain\Service as ContentRepository;
use Neos\Neos\Ui\Domain\Model\Feedback\Operations\RemoveNode;
use Neos\Flow\Annotations as Flow;
use Neos\Neos\Ui\Domain\Model\Feedback\Operations\UpdateNodePath;

abstract class AbstractMove extends AbstractStructuralChange
{
    /**
     * @Flow\Inject
     * @var ContentRepository\NodeServiceInterface
     */
    protected $contentRepositoryNodeService;

    /**
     * Perform finish tasks - needs to be called from inheriting class on `apply`
     *
     * @param NodeInterface $node
     * @return void
     */
    protected function finish(NodeInterface $node)
    {
        if ($node->getContextPath() !== $this->getSubject()->getContextPath()) {
            $updateNodePath = new UpdateNodePath();
            $updateNodePath->setOldContextPath($node->getContextPath());
            $updateNodePath->setNewContextPath($this->getSubject()->getContextPath());
            $this->feedbackCollection->add($updateNodePath);
        }

        // $this->getSubject() is the moved node at the NEW location!
        parent::finish($this->getSubject());
    }

    protected static function cloneNodeWithNodeData(NodeInterface $node)
    {
        if ($node instanceof Node) {
            $originalNode = $node;
            $node = clone $originalNode;
            $node->setNodeData(clone $originalNode->getNodeData());

            return $node;
        } else {
            // do a best-effort clone
            return clone $node;
        }
    }

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

    /**
     * Returns true if the current name of $node is "free" below $parentNode
     *
     * @param NodeInterface $parentNode
     * @param NodeInterface $node
     * @return bool
     */
    protected function nodeNameAvailableBelowNode(NodeInterface $parentNode, NodeInterface $node)
    {
        return $this->contentRepositoryNodeService->nodePathAvailableForNode($parentNode->getPath() . '/' . $node->getName(), $node);
    }
}
