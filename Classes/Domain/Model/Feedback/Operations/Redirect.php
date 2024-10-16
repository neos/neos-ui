<?php
namespace Neos\Neos\Ui\Domain\Model\Feedback\Operations;

use Neos\ContentRepository\Core\Projection\ContentGraph\Node;
use Neos\ContentRepository\Core\SharedModel\Node\NodeAddress;
use Neos\ContentRepositoryRegistry\ContentRepositoryRegistry;
use Neos\Flow\Annotations as Flow;
use Neos\Flow\Mvc\Controller\ControllerContext;
use Neos\Neos\Domain\NodeLabel\NodeLabelGeneratorInterface;
use Neos\Neos\FrontendRouting\NodeUriBuilderFactory;
use Neos\Neos\FrontendRouting\Options;
use Neos\Neos\Ui\Domain\Model\AbstractFeedback;
use Neos\Neos\Ui\Domain\Model\FeedbackInterface;

/**
 * @internal
 */
class Redirect extends AbstractFeedback
{
    /**
     * @var \Neos\ContentRepository\Core\Projection\ContentGraph\Node
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
     * @Flow\Inject
     * @var NodeUriBuilderFactory
     */
    protected $nodeUriBuilderFactory;

    /**
     * Set the node
     *
     * @param \Neos\ContentRepository\Core\Projection\ContentGraph\Node $node
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
        return 'Neos.Neos.Ui:Redirect';
    }

    /**
     * Get the description
     *
     * @return string
     */
    public function getDescription()
    {
        return sprintf('Redirect to node "%s".', $this->nodeLabelGenerator->getLabel($this->getNode()));
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
        $node = $this->getNode();

        $redirectUri = $this->nodeUriBuilderFactory->forActionRequest($controllerContext->getRequest())
            ->uriFor(
                NodeAddress::fromNode($node),
                Options::createForceAbsolute()
            );

        $contentRepository = $this->contentRepositoryRegistry->get($node->contentRepositoryId);

        return [
            'redirectUri' => (string)$redirectUri,
            'redirectContextPath' => NodeAddress::fromNode($node)->toJson(),
        ];
    }
}
