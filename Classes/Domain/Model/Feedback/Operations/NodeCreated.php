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
use Neos\Neos\Domain\Service\NodeTypeNameFactory;
use Neos\Neos\Ui\Domain\Model\AbstractFeedback;
use Neos\Neos\Ui\Domain\Model\FeedbackInterface;

/**
 * @internal
 */
class NodeCreated extends AbstractFeedback
{
    #[Flow\Inject]
    protected ContentRepositoryRegistry $contentRepositoryRegistry;

    /**
     * @var Node
     */
    protected $node;

    /**
     * Set the node
     */
    public function setNode(Node $node): void
    {
        $this->node = $node;
    }

    /**
     * Get the node
     */
    public function getNode(): Node
    {
        return $this->node;
    }

    /**
     * Get the type identifier
     */
    public function getType(): string
    {
        return 'Neos.Neos.Ui:NodeCreated';
    }

    /**
     * Get the description
     */
    public function getDescription(): string
    {
        return sprintf('Document Node "%s" created.', $this->getNode()->aggregateId->value);
    }

    /**
     * Checks whether this feedback is similar to another
     *
     * @param FeedbackInterface $feedback
     * @return boolean
     */
    public function isSimilarTo(FeedbackInterface $feedback)
    {
        if (!$feedback instanceof NodeCreated) {
            return false;
        }

        return $this->getNode()->equals($feedback->getNode());
    }

    /**
     * Serialize the payload for this feedback
     *
     * @param ControllerContext $controllerContext
     * @return mixed
     */
    public function serializePayload(ControllerContext $controllerContext)
    {
        $node = $this->getNode();
        $contentRepository = $this->contentRepositoryRegistry->get($node->contentRepositoryId);
        $nodeType = $contentRepository->getNodeTypeManager()->getNodeType($node->nodeTypeName);

        return [
            'contextPath' => NodeAddress::fromNode($node)->toJson(),
            'identifier' => $node->aggregateId->value,
            'isDocument' => $nodeType?->isOfType(NodeTypeNameFactory::NAME_DOCUMENT)
        ];
    }
}
