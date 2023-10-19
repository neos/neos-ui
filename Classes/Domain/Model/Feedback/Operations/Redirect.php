<?php
namespace Neos\Neos\Ui\Domain\Model\Feedback\Operations;

use Neos\ContentRepository\Core\Projection\ContentGraph\Node;
use Neos\ContentRepositoryRegistry\ContentRepositoryRegistry;
use Neos\Flow\Annotations as Flow;
use Neos\Flow\Mvc\Controller\ControllerContext;
use Neos\Neos\FrontendRouting\NodeAddressFactory;
use Neos\Neos\Service\LinkingService;
use Neos\Neos\Ui\Domain\Model\AbstractFeedback;
use Neos\Neos\Ui\Domain\Model\FeedbackInterface;

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
     * @var LinkingService
     */
    protected $linkingService;

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
        return sprintf('Redirect to node "%s".', $this->getNode()->getLabel());
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

        return $this->getNode()->subgraphIdentity->equals($feedback->getNode()->subgraphIdentity);
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
        $redirectUri = $this->linkingService->createNodeUri($controllerContext, $node, null, null, true);
        $contentRepository = $this->contentRepositoryRegistry->get($node->subgraphIdentity->contentRepositoryId);
        $nodeAddressFactory = NodeAddressFactory::create($contentRepository);

        return [
            'redirectUri' => $redirectUri,
            'redirectContextPath' => $nodeAddressFactory->createFromNode($node)->serializeForUri(),
        ];
    }
}
