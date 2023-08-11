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

use Neos\ContentRepository\Core\Projection\ContentGraph\Filter\FindChildNodesFilter;
use Neos\ContentRepository\Core\Projection\ContentGraph\Node;
use Neos\Neos\FrontendRouting\NodeAddressFactory;
use Neos\ContentRepositoryRegistry\ContentRepositoryRegistry;
use Neos\Flow\Annotations as Flow;
use Neos\Flow\Mvc\Controller\ControllerContext;
use Neos\Neos\Ui\Domain\Model\AbstractFeedback;
use Neos\Neos\Ui\Domain\Model\FeedbackInterface;
use Neos\Neos\Ui\Fusion\Helper\NodeInfoHelper;

class UpdateNodeInfo extends AbstractFeedback
{
    protected ?Node $node;

    /**
     * @Flow\Inject
     * @var NodeInfoHelper
     */
    protected $nodeInfoHelper;

    /**
     * @Flow\Inject
     * @var ContentRepositoryRegistry
     */
    protected $contentRepositoryRegistry;

    protected bool $isRecursive = false;

    protected ?string $baseNodeType = null;

    public function setBaseNodeType(?string $baseNodeType): void
    {
        $this->baseNodeType = $baseNodeType;
    }

    public function getBaseNodeType(): ?string
    {
        return $this->baseNodeType;
    }

    public function setNode(Node $node): void
    {
        $this->node = $node;
    }

    /**
     * Update node infos recursively
     */
    public function recursive(): void
    {
        $this->isRecursive = true;
    }

    public function getNode(): ?Node
    {
        return $this->node;
    }

    public function getType(): string
    {
        return 'Neos.Neos.Ui:UpdateNodeInfo';
    }

    public function getDescription(): string
    {
        return sprintf('Updated info for node "%s" is available.', $this->node?->nodeAggregateId->value);
    }

    /**
     * Checks whether this feedback is similar to another
     */
    public function isSimilarTo(FeedbackInterface $feedback): bool
    {
        if (!$feedback instanceof UpdateNodeInfo) {
            return false;
        }
        $feedbackNode = $feedback->getNode();

        return $this->node && $feedbackNode && $this->node->nodeAggregateId->equals(
            $feedbackNode->nodeAggregateId
        );
    }

    /**
     * Serialize the payload for this feedback
     *
     * @return array<string,mixed>
     */
    public function serializePayload(ControllerContext $controllerContext): array
    {
        return $this->node
            ? [
                'byContextPath' => $this->serializeNodeRecursively($this->node, $controllerContext)
            ]
            : [];
    }

    /**
     * Serialize node and all child nodes
     *
     * @return array<string,?array<string,mixed>>
     */
    public function serializeNodeRecursively(Node $node, ControllerContext $controllerContext): array
    {
        $contentRepository = $this->contentRepositoryRegistry->get($node->subgraphIdentity->contentRepositoryId);
        $nodeAddressFactory = NodeAddressFactory::create($contentRepository);

        $result = [
            $nodeAddressFactory->createFromNode($node)->serializeForUri()
            => $this->nodeInfoHelper->renderNodeWithPropertiesAndChildrenInformation(
                $node,
                $controllerContext
            )
        ];

        if ($this->isRecursive === true) {
            $subgraph = $this->contentRepositoryRegistry->subgraphForNode($node);
            foreach ($subgraph->findChildNodes($node->nodeAggregateId, FindChildNodesFilter::create()) as $childNode) {
                $result = array_merge($result, $this->serializeNodeRecursively($childNode, $controllerContext));
            }
        }

        return $result;
    }
}
