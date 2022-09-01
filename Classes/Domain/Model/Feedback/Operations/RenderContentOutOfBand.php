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
use Neos\Neos\FrontendRouting\NodeAddressFactory;
use Neos\ContentRepositoryRegistry\ContentRepositoryRegistry;
use Neos\Flow\Annotations as Flow;
use Neos\Flow\Mvc\Controller\ControllerContext;
use Neos\Fusion\Core\Cache\ContentCache;
use Neos\Fusion\Exception as FusionException;
use Neos\Neos\Fusion\Helper\CachingHelper;
use Neos\Neos\Ui\Domain\Model\AbstractFeedback;
use Neos\Neos\Ui\Domain\Model\FeedbackInterface;
use Neos\Neos\Ui\Domain\Model\RenderedNodeDomAddress;
use Neos\Neos\View\FusionView;
use Psr\Http\Message\ResponseInterface;

class RenderContentOutOfBand extends AbstractFeedback
{
    protected ?Node $node = null;

    /**
     * The node dom address for the parent node of the created node
     */
    protected ?RenderedNodeDomAddress $parentDomAddress = null;

    /**
     * The node dom address for the referenced sibling node of the created node
     */
    protected ?RenderedNodeDomAddress $siblingDomAddress = null;

    protected ?string $mode = null;

    /**
     * @Flow\Inject
     * @var ContentCache
     */
    protected $contentCache;

    /**
     * @Flow\Inject
     * @var CachingHelper
     */
    protected $cachingHelper;

    /**
     * @Flow\Inject
     * @var ContentRepositoryRegistry
     */
    protected $contentRepositoryRegistry;

    public function setNode(Node $node): void
    {
        $this->node = $node;
    }

    public function getNode(): ?Node
    {
        return $this->node;
    }

    public function setParentDomAddress(RenderedNodeDomAddress $parentDomAddress = null): void
    {
        $this->parentDomAddress = $parentDomAddress;
    }

    public function getParentDomAddress(): ?RenderedNodeDomAddress
    {
        return $this->parentDomAddress;
    }

    public function setSiblingDomAddress(RenderedNodeDomAddress $siblingDomAddress = null): void
    {
        $this->siblingDomAddress = $siblingDomAddress;
    }

    public function getSiblingDomAddress(): ?RenderedNodeDomAddress
    {
        return $this->siblingDomAddress;
    }

    /**
     * Set the insertion mode (before|after|into)
     */
    public function setMode(string $mode): void
    {
        $this->mode = $mode;
    }

    /**
     * Get the insertion mode (before|after|into)
     */
    public function getMode(): ?string
    {
        return $this->mode;
    }

    public function getType(): string
    {
        return 'Neos.Neos.Ui:RenderContentOutOfBand';
    }

    public function getDescription(): string
    {
        return sprintf('Rendering of node "%s" required.', $this->node?->nodeAggregateId);
    }

    /**
     * Checks whether this feedback is similar to another
     */
    public function isSimilarTo(FeedbackInterface $feedback): bool
    {
        if (!$feedback instanceof RenderContentOutOfBand) {
            return false;
        }
        if (is_null($this->node)) {
            return false;
        }
        $feedbackNode = $feedback->getNode();
        if (is_null($feedbackNode)) {
            return false;
        }

        return (
            $this->node->subgraphIdentity->equals($feedbackNode->subgraphIdentity) &&
            $this->node->nodeAggregateId->equals($feedbackNode->nodeAggregateId)
            // @todo what's this? && $this->getReferenceData() == $feedback->getReferenceData()
        );
    }

    /**
     * Serialize the payload for this feedback
     *
     * @return array<string,mixed>
     */
    public function serializePayload(ControllerContext $controllerContext): array
    {
        if (!is_null($this->node)) {
            $contentRepository = $this->contentRepositoryRegistry->get($this->node->subgraphIdentity->contentRepositoryId);
            $nodeAddressFactory = NodeAddressFactory::create($contentRepository);
            return [
                'contextPath' => $nodeAddressFactory->createFromNode($this->node)->serializeForUri(),
                'parentDomAddress' => $this->getParentDomAddress(),
                'siblingDomAddress' => $this->getSiblingDomAddress(),
                'mode' => $this->getMode(),
                'renderedContent' => $this->renderContent($controllerContext)
            ];
        }
        return [];
    }

    /**
     * Render the node
     */
    protected function renderContent(ControllerContext $controllerContext): string|ResponseInterface
    {
        if (is_null($this->node)) {
            return '';
        }
        $subgraph = $this->contentRepositoryRegistry->subgraphForNode($this->node);
        $parentNode = $subgraph->findParentNode($this->node->nodeAggregateId);
        if ($parentNode) {
            $cacheTags = $this->cachingHelper->nodeTag($parentNode);
            foreach ($cacheTags as $tag) {
                $this->contentCache->flushByTag($tag);
            }

            $parentDomAddress = $this->getParentDomAddress();
            if ($parentDomAddress) {
                $fusionView = new FusionView();
                $fusionView->setControllerContext($controllerContext);

                $fusionView->assign('value', $parentNode);
                $fusionView->setFusionPath($parentDomAddress->getFusionPath());

                return $fusionView->render();
            }
        }

        return '';
    }

    /**
     * @return array<string,mixed>
     */
    public function serialize(ControllerContext $controllerContext): array
    {
        try {
            return parent::serialize($controllerContext);
        } catch (FusionException $e) {
            // in case there was a rendering error, we just try to reload the document as fallback. Needed
            // e.g. when adding validators to Neos.FormBuilder
            return (new ReloadDocument())->serialize($controllerContext);
        }
    }
}
