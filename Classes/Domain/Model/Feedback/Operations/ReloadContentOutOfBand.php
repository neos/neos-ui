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
class ReloadContentOutOfBand extends AbstractFeedback
{
    protected Node $node;

    protected ?RenderedNodeDomAddress $nodeDomAddress;

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

    public function getNode(): Node
    {
        return $this->node;
    }

    public function setNodeDomAddress(RenderedNodeDomAddress $nodeDomAddress = null): void
    {
        $this->nodeDomAddress = $nodeDomAddress;
    }

    public function getNodeDomAddress(): ?RenderedNodeDomAddress
    {
        return $this->nodeDomAddress;
    }

    public function getType(): string
    {
        return 'Neos.Neos.Ui:ReloadContentOutOfBand';
    }

    public function getDescription(): string
    {
        return sprintf('Rendering of node "%s" required.', $this->node->aggregateId->value);
    }

    /**
     * Checks whether this feedback is similar to another
     */
    public function isSimilarTo(FeedbackInterface $feedback): bool
    {
        if (!$feedback instanceof ReloadContentOutOfBand) {
            return false;
        }

        return $this->getNode()->equals($feedback->getNode())
            && $this->getNodeDomAddress() == $feedback->getNodeDomAddress();
    }

    /**
     * Serialize the payload for this feedback
     *
     * @return array<string,mixed>
     */
    public function serializePayload(ControllerContext $controllerContext): array
    {
        if (!is_null($this->nodeDomAddress)) {
            return [
                'contextPath' => NodeAddress::fromNode($this->node)->toJson(),
                'nodeDomAddress' => $this->nodeDomAddress,
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
        $cacheTags = $this->cachingHelper->nodeTag($this->node);
        foreach ($cacheTags as $tag) {
            $this->contentCache->flushByTag($tag);
        }

        if ($this->nodeDomAddress) {
            $renderingMode = $this->renderingModeService->findByCurrentUser();

            $view = $this->outOfBandRenderingViewFactory->resolveView();
            if (method_exists($view, 'setControllerContext')) {
                // deprecated
                $view->setControllerContext($controllerContext);
            }
            $view->setOption('renderingModeName', $renderingMode->name);

            $view->assign('value', $this->node);
            $view->setRenderingEntryPoint($this->nodeDomAddress->getFusionPathForContentRendering());

            $content = $view->render();
            if ($content instanceof ResponseInterface) {
                // todo should not happen, as we never render a full Neos.Neos:Page here?
                return $content->getBody()->getContents();
            }
            return $content->getContents();
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
