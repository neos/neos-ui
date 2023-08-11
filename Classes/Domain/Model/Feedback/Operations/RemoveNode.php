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

use Neos\ContentRepositoryRegistry\ContentRepositoryRegistry;
use Neos\Flow\Annotations as Flow;
use Neos\Neos\FrontendRouting\NodeAddressFactory;
use Neos\ContentRepository\Core\Projection\ContentGraph\Node;
use Neos\Flow\Mvc\Controller\ControllerContext;
use Neos\Neos\Ui\Domain\Model\AbstractFeedback;
use Neos\Neos\Ui\Domain\Model\FeedbackInterface;

class RemoveNode extends AbstractFeedback
{
    protected Node $node;

    protected Node $parentNode;

    /**
     * @Flow\Inject
     * @var ContentRepositoryRegistry
     */
    protected $contentRepositoryRegistry;

    public function __construct(Node $node, Node $parentNode)
    {
        $this->node = $node;
        $this->parentNode = $parentNode;
    }

    public function getNode(): Node
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
        return 'Neos.Neos.Ui:RemoveNode';
    }

    /**
     * Get the description
     *
     * @return string
     */
    public function getDescription(): string
    {
        return sprintf('Node "%s" has been removed.', $this->getNode()->getLabel());
    }

    /**
     * Checks whether this feedback is similar to another
     *
     * @param FeedbackInterface $feedback
     * @return boolean
     */
    public function isSimilarTo(FeedbackInterface $feedback)
    {
        if (!$feedback instanceof RemoveNode) {
            return false;
        }

        return $this->getNode()->nodeAggregateId->equals(
            $feedback->getNode()->nodeAggregateId
        );
    }

    /**
     * Serialize the payload for this feedback
     *
     * @param ControllerContext $controllerContext
     * @return mixed
     */
    public function serializePayload(ControllerContext $controllerContext)
    {
        $contentRepository = $this->contentRepositoryRegistry->get($this->node->subgraphIdentity->contentRepositoryId);
        $nodeAddressFactory = NodeAddressFactory::create($contentRepository);
        return [
            'contextPath' => $nodeAddressFactory->createFromNode($this->node)->serializeForUri(),
            'parentContextPath' => $nodeAddressFactory->createFromNode($this->parentNode)->serializeForUri()
        ];
    }
}
