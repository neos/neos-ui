<?php
namespace Neos\Neos\Ui\Domain\Model\Feedback\Operations;

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
use Neos\Flow\Annotations as Flow;
use Neos\Flow\Mvc\Controller\ControllerContext;
use Neos\Neos\Ui\Domain\Model\AbstractFeedback;
use Neos\Neos\Ui\Domain\Model\FeedbackInterface;
use Neos\Neos\Ui\Fusion\Helper\NodeInfoHelper;

class UpdateNodeInfo extends AbstractFeedback
{
    /**
     * @var NodeInterface
     */
    protected $node;

    /**
     * @Flow\Inject
     * @var NodeInfoHelper
     */
    protected $nodeInfoHelper;

    protected $isRecursive = false;

    protected $baseNodeType = null;

    /**
     * Set the baseNodeType
     *
     * @param string|null $baseNodeType
     */
    public function setBaseNodeType(?string $baseNodeType): void
    {
        $this->baseNodeType = $baseNodeType;
    }

    /**
     * Get the baseNodeType
     *
     * @return string|null
     */
    public function getBaseNodeType(): ?string
    {
        return $this->baseNodeType;
    }

    /**
     * Set the node
     *
     * @param NodeInterface $node
     * @return void
     */
    public function setNode(NodeInterface $node)
    {
        $this->node = $node;
    }

    /**
     * Update node infos recursively
     *
     * @return void
     */
    public function recursive()
    {
        $this->isRecursive = true;
    }

    /**
     * Get the node
     *
     * @return NodeInterface
     */
    public function getNode()
    {
        return $this->node;
    }

    /**
     * Get the type identifier
     *
     * @return string
     */
    public function getType()
    {
        return 'Neos.Neos.Ui:UpdateNodeInfo';
    }

    /**
     * Get the description
     *
     * @return string
     */
    public function getDescription()
    {
        return sprintf('Updated info for node "%s" is available.', $this->getNode()->getContextPath());
    }

    /**
     * Checks whether this feedback is similar to another
     *
     * @param FeedbackInterface $feedback
     * @return boolean
     */
    public function isSimilarTo(FeedbackInterface $feedback)
    {
        if (!$feedback instanceof UpdateNodeInfo) {
            return false;
        }

        return $this->getNode()->getContextPath() === $feedback->getNode()->getContextPath();
    }

    /**
     * Serialize the payload for this feedback
     *
     * @param ControllerContext $controllerContext
     * @return mixed
     */
    public function serializePayload(ControllerContext $controllerContext)
    {
        return [
            'byContextPath' => $this->serializeNodeRecursively($this->getNode(), $controllerContext)
        ];
    }

    /**
     * Serialize node and all child nodes
     *
     * @param NodeInterface $node
     * @param ControllerContext $controllerContext
     * @return array
     */
    public function serializeNodeRecursively(NodeInterface $node, ControllerContext $controllerContext)
    {
        $result = [
            $node->getContextPath() => $this->nodeInfoHelper->renderNodeWithPropertiesAndChildrenInformation($node, $controllerContext, $this->baseNodeType)
        ];

        if ($this->isRecursive === true) {
            foreach ($node->getChildNodes() as $childNode) {
                $result = array_merge($result, $this->serializeNodeRecursively($childNode, $controllerContext));
            }
        }

        return $result;
    }
}
