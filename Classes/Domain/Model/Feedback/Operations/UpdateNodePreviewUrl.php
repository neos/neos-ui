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

use Neos\ContentRepository\Core\Projection\ContentGraph\Node;
use Neos\ContentRepository\Core\SharedModel\Node\NodeAddress;
use Neos\ContentRepositoryRegistry\ContentRepositoryRegistry;
use Neos\Flow\Annotations as Flow;
use Neos\Flow\Mvc\Controller\ControllerContext;
use Neos\Neos\Domain\NodeLabel\NodeLabelGeneratorInterface;
use Neos\Neos\Ui\Domain\Model\AbstractFeedback;
use Neos\Neos\Ui\Domain\Model\FeedbackInterface;
use Neos\Neos\Ui\Fusion\Helper\NodeInfoHelper;

/**
 * @internal
 */
class UpdateNodePreviewUrl extends AbstractFeedback
{
    /**
     * @var Node
     */
    protected $node;

    /**
     * @Flow\Inject
     * @var ContentRepositoryRegistry
     */
    protected $contentRepositoryRegistry;

    /**
     * @Flow\Inject
     * @var NodeLabelGeneratorInterface
     */
    protected $nodeLabelGenerator;

    /**
     * Set the node
     *
     * @param Node $node
     * @return void
     */
    public function setNode(Node $node)
    {
        $this->node = $node;
    }

    /**
     * Get the node
     *
     * @return Node
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
        return 'Neos.Neos.Ui:UpdateNodePreviewUrl';
    }

    /**
     * Get the description
     *
     * @return string
     */
    public function getDescription()
    {
        return sprintf('The "preview URL" of node "%s" has been changed potentially.', $this->nodeLabelGenerator->getLabel($this->getNode()));
    }

    /**
     * Checks whether this feedback is similar to another
     *
     * @param FeedbackInterface $feedback
     * @return boolean
     */
    public function isSimilarTo(FeedbackInterface $feedback)
    {
        if (!$feedback instanceof UpdateNodePreviewUrl) {
            return false;
        }
        return $this->getNode()->equals($feedback->getNode());
    }

    /**
     * Serialize the payload for this feedback
     *
     * @param ControllerContext $controllerContext
     * @return array<string, string>
     */
    public function serializePayload(ControllerContext $controllerContext): array
    {
        if ($this->node === null) {
            $newPreviewUrl = '';
            $contextPath = '';
        } else {
            $nodeInfoHelper = new NodeInfoHelper();
            $newPreviewUrl = $nodeInfoHelper->createRedirectToNode($this->node, $controllerContext->getRequest());
            $contextPath = NodeAddress::fromNode($this->node)->toJson();
        }
        return [
            'newPreviewUrl' => $newPreviewUrl,
            'contextPath' => $contextPath,
        ];
    }
}
