<?php

/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

declare(strict_types=1);

namespace Neos\Neos\Ui\Domain\Model\Feedback\Operations;

use Neos\ContentRepository\Core\Projection\ContentGraph\Node;
use Neos\ContentRepository\Core\SharedModel\Node\NodeAddress;
use Neos\ContentRepositoryRegistry\ContentRepositoryRegistry;
use Neos\Flow\Annotations as Flow;
use Neos\Flow\Mvc\Controller\ControllerContext;
use Neos\Fusion\Core\Cache\ContentCache;
use Neos\Fusion\Exception as FusionException;
use Neos\Neos\Domain\Service\RenderingModeService;
use Neos\Neos\Fusion\Helper\CachingHelper;
use Neos\Neos\Ui\Domain\Model\AbstractFeedback;
use Neos\Neos\Ui\Domain\Model\FeedbackInterface;
use Neos\Neos\Ui\Domain\Model\RenderedNodeDomAddress;
use Neos\Neos\Ui\View\OutOfBandRenderingViewFactory;
use Psr\Http\Message\ResponseInterface;

/**
 * @internal
 */
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

    #[Flow\Inject]
    protected RenderingModeService $renderingModeService;

    #[Flow\Inject]
    protected OutOfBandRenderingViewFactory $outOfBandRenderingViewFactory;

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
        return sprintf('Rendering of node "%s" required.', $this->node?->aggregateId->value);
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

        return $this->node->equals($feedbackNode);
        // @todo what's this? && $this->getReferenceData() == $feedback->getReferenceData()
    }

    /**
     * Serialize the payload for this feedback
     *
     * @return array<string,mixed>
     */
    public function serializePayload(ControllerContext $controllerContext): array
    {
        if (!is_null($this->node)) {
            return [
                'contextPath' => NodeAddress::fromNode($this->node)->toJson(),
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
    protected function renderContent(ControllerContext $controllerContext): string
    {
        if (is_null($this->node)) {
            return '';
        }
        $subgraph = $this->contentRepositoryRegistry->subgraphForNode($this->node);
        $parentNode = $subgraph->findParentNode($this->node->aggregateId);
        if ($parentNode) {
            $cacheTags = $this->cachingHelper->nodeTag($parentNode);
            foreach ($cacheTags as $tag) {
                $this->contentCache->flushByTag($tag);
            }

            $parentDomAddress = $this->getParentDomAddress();
            if ($parentDomAddress) {
                $renderingMode = $this->renderingModeService->findByCurrentUser();

                $view = $this->outOfBandRenderingViewFactory->resolveView();
                if (method_exists($view, 'setControllerContext')) {
                    // deprecated
                    $view->setControllerContext($controllerContext);
                }
                $view->setOption('renderingModeName', $renderingMode->name);

                $view->assign('value', $parentNode);
                $view->setRenderingEntryPoint($parentDomAddress->getFusionPath());

                $content = $view->render();
                if ($content instanceof ResponseInterface) {
                    // todo should not happen, as we never render a full Neos.Neos:Page here?
                    return $content->getBody()->getContents();
                }
                return $content->getContents();
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
