<?php
namespace Neos\Neos\Ui\Aspects;

/*                                                                        *
 * This script belongs to the Neos Flow package "Neos.Neos.Ui".          *
 *                                                                        *
 *                                                                        */

use Neos\ContentRepository\Domain\Model\NodeInterface;
use Neos\ContentRepository\Service\AuthorizationService;
use Neos\Flow\Annotations as Flow;
use Neos\Flow\Aop\JoinPointInterface;
use Neos\Flow\I18n\Locale;
use Neos\Flow\I18n\Service as I18nService;
use Neos\Flow\Session\SessionInterface;
use Neos\FluidAdaptor\Core\Rendering\FlowAwareRenderingContextInterface;
use Neos\Neos\Domain\Service\ContentContext;
use Neos\Neos\Domain\Service\UserService;
use Neos\Neos\Service\HtmlAugmenter;
use Neos\Neos\Ui\Fusion\Helper\NodeInfoHelper;

/**
 * - Serialize all nodes related to the currently rendered document
 * - Analyze the rendered response for nodes that are foreign to the current document and serialize them too
 *
 * @Flow\Scope("singleton")
 * @Flow\Aspect
 */
class AugmentationAspect
{

    /**
     * @Flow\Inject
     * @var AuthorizationService
     */
    protected $nodeAuthorizationService;

    /**
     * @Flow\Inject
     * @var HtmlAugmenter
     */
    protected $htmlAugmenter;

    /**
     * @Flow\Inject
     * @var I18nService
     */
    protected $i18nService;

    /**
     * @Flow\Inject
     * @var UserService
     */
    protected $userService;

    /**
     * @Flow\Inject
     * @var NodeInfoHelper
     */
    protected $nodeInfoHelper;

    /**
     * @Flow\Inject
     * @var SessionInterface
     */
    protected $session;

    /**
     * Current controller context, will be set by advices
     *
     * This is a workaround to have the controller context available
     * inside the wrapContentObject() advice. It will not be necessary once we implement a custom content element
     * wrapping implementation.
     *
     * @var \Neos\Flow\Mvc\Controller\ControllerContext
     */
    protected $controllerContext = null;

    /**
     * All editable nodes rendered in the document
     *
     * @var array
     */
    protected $renderedNodes = [];

    /**
     * String containing `<script>` tags for non rendered nodes
     *
     * @var string
     */
    protected $nonRenderedContentNodeMetadata;

    /**
     * @Flow\Before("method(Neos\Neos\Fusion\ContentElementWrappingImplementation->evaluate())")
     * @param JoinPointInterface $joinPoint
     * @return mixed
     */
    public function setControllerContextFromContentElementWrappingImplementation(JoinPointInterface $joinPoint)
    {
        /** @var \Neos\Neos\Fusion\ContentElementWrappingImplementation $proxy */
        $proxy = $joinPoint->getProxy();
        $runtime = $proxy->getRuntime();
        $this->controllerContext = $runtime->getControllerContext();
    }

    /**
     * @Flow\Before("method(Neos\Neos\ViewHelpers\ContentElement\WrapViewHelper->setRenderingContext())")
     * @param JoinPointInterface $joinPoint
     * @return mixed
     */
    public function setControllerContextFromWrapViewHelper(JoinPointInterface $joinPoint)
    {
        $renderingContext = $joinPoint->getMethodArgument('renderingContext');
        if ($renderingContext instanceof FlowAwareRenderingContextInterface) {
            $this->controllerContext = $renderingContext->getControllerContext();
        }
    }

    /**
     * Hooks into standard content element wrapping to render those attributes needed for the package to identify
     * nodes and Fusion paths
     *
     * @Flow\Around("method(Neos\Neos\Service\ContentElementWrappingService->wrapContentObject())")
     * @param JoinPointInterface $joinPoint the join point
     * @return mixed
     */
    public function contentElementAugmentation(JoinPointInterface $joinPoint)
    {
        if (!$this->session->isStarted() || !$this->session->getData('__neosEnabled__')) {
            return $joinPoint->getAdviceChain()->proceed($joinPoint);
        }

        /** @var NodeInterface $node */
        $node = $joinPoint->getMethodArgument('node');
        $content = $joinPoint->getMethodArgument('content');

        // Stay compatible with Neos 3.0. When we remove this compatibility, we can convert everything to "fusionPath").
        $fusionPath = ($joinPoint->isMethodArgument('typoScriptPath') ? $joinPoint->getMethodArgument('typoScriptPath'): $joinPoint->getMethodArgument('fusionPath'));

        $fusionPath = $this->postprocessFusionPath($fusionPath);

        if (!$this->needsMetadata($node, false)) {
            return $content;
        }

        $attributes = [
            'data-__neos-node-contextpath' => $node->getContextPath(),
            'data-__neos-fusion-path' => $fusionPath
        ];

        $this->renderedNodes[$node->getIdentifier()] = $node;

        // For serialization, we need to respect the UI locale, rather than the content locale
        $rememberedContentLocale = $this->i18nService->getConfiguration()->getCurrentLocale();
        $userLocale = new Locale($this->userService->getCurrentUser()->getPreferences()->getInterfaceLanguage());
        $this->i18nService->getConfiguration()->setCurrentLocale($userLocale);

        $serializedNode = json_encode($this->nodeInfoHelper->renderNode($node, $this->controllerContext));

        // Reset the locale
        $this->i18nService->getConfiguration()->setCurrentLocale($rememberedContentLocale);

        $wrappedContent = $this->htmlAugmenter->addAttributes($content, $attributes, 'div');
        $wrappedContent .= "<script>(function(){(this['@Neos.Neos.Ui:Nodes'] = this['@Neos.Neos.Ui:Nodes'] || {})['{$node->getContextPath()}'] = {$serializedNode}})()</script>";;
        return $wrappedContent;
    }

    /**
     * Hooks into the editable viewhelper to render those attributes needed for the package's inline editing
     *
     * @Flow\Around("method(Neos\Neos\Service\ContentElementEditableService->wrapContentProperty())")
     * @param JoinPointInterface $joinPoint the join point
     * @return mixed
     */
    public function editableElementAugmentation(JoinPointInterface $joinPoint)
    {
        if (!$this->session->isStarted() || !$this->session->getData('__neosEnabled__')) {
            return $joinPoint->getAdviceChain()->proceed($joinPoint);
        }

        $property = $joinPoint->getMethodArgument('property');
        $node = $joinPoint->getMethodArgument('node');
        $content = $joinPoint->getMethodArgument('content');

        /** @var ContentContext $contentContext */
        $contentContext = $node->getContext();
        if (!$contentContext->isInBackend()) {
            return $content;
        }

        $content = $joinPoint->getAdviceChain()->proceed($joinPoint);

        $attributes = [
            'data-__neos-property' => $property,
            'data-__neos-editable-node-contextpath' => $node->getContextPath()
        ];

        return $this->htmlAugmenter->addAttributes($content, $attributes, 'span');
    }

    /**
     * @param NodeInterface $node
     * @param boolean $renderCurrentDocumentMetadata
     * @return boolean
     */
    protected function needsMetadata(NodeInterface $node, $renderCurrentDocumentMetadata)
    {
        /** @var $contentContext ContentContext */
        $contentContext = $node->getContext();
        return ($contentContext->isInBackend() === true && ($renderCurrentDocumentMetadata === true || $this->nodeAuthorizationService->isGrantedToEditNode($node) === true));
    }

    /**
     * Concatenate strings containing `<script>` tags for all child nodes not rendered
     * within the current document node. This way we can show e.g. content collections
     * within the structure tree which are not actually rendered.
     *
     * @param NodeInterface $documentNode
     */
    protected function appendNonRenderedContentNodeMetadata(NodeInterface $documentNode)
    {
        foreach ($documentNode->getChildNodes() as $node) {
            if ($node->getNodeType()->isOfType('Neos.Neos:Document') === true) {
                continue;
            }

            if (isset($this->renderedNodes[$node->getIdentifier()]) === false) {
              $serializedNode = json_encode($this->nodeInfoHelper->renderNode($node, $this->controllerContext));
              $this->nonRenderedContentNodeMetadata .= "<script>(function(){(this['@Neos.Neos.Ui:Nodes'] = this['@Neos.Neos.Ui:Nodes'] || {})['{$node->getContextPath()}'] = {$serializedNode}})()</script>";
            }

            if ($node->hasChildNodes() === true) {
                $this->nonRenderedContentNodeMetadata .= $this->appendNonRenderedContentNodeMetadata($node);
            }
        }
    }

    /**
     * Clear rendered nodes helper array to prevent possible side effects.
     */
    protected function clearRenderedNodesArray() {
        $this->renderedNodes = [];
    }

    /**
     * Clear non rendered content node metadata to prevent possible side effects.
     */
    protected function clearNonRenderedContentNodeMetadata() {
        $this->nonRenderedContentNodeMetadata = '';
    }

    /**
     * @param NodeInterface $documentNode
     * @return string
     */
    public function getNonRenderedContentNodeMetadata(NodeInterface $documentNode)
    {
        $this->appendNonRenderedContentNodeMetadata($documentNode);
        $nonRenderedContentNodeMetadata = $this->nonRenderedContentNodeMetadata;
        $this->clearNonRenderedContentNodeMetadata();
        $this->clearRenderedNodesArray();
        return $nonRenderedContentNodeMetadata;
    }

    /**
     * This method is a quick-fix for backwards compatibility until
     * https://github.com/neos/neos-development-collection/pull/1635 has
     * landed in the stable Neos 3.2 version. When the React UI starts
     * supporting Neos 3.2 ONLY, this method can be removed; as the
     * functionality is then correct in Neos ContentElementWrappingImplementation::getContentElementFusionPath
     *
     * @param $fusionPath
     * @return string the processing information cropped from FusionPath
     */
    private function postprocessFusionPath($fusionPath)
    {
        $fusionPathSegments = explode('/', $fusionPath);
        $numberOfFusionPathSegments = count($fusionPathSegments);
        if (isset($fusionPathSegments[$numberOfFusionPathSegments - 3])
            && $fusionPathSegments[$numberOfFusionPathSegments - 3] === '__meta'
            && isset($fusionPathSegments[$numberOfFusionPathSegments - 2])
            && $fusionPathSegments[$numberOfFusionPathSegments - 2] === 'process') {

            // cut off the SHORTCUT processing syntax "__meta/process/contentElementWrapping<Neos.Neos:ContentElementWrapping>"
            return implode('/', array_slice($fusionPathSegments, 0, -3));
        }

        if (isset($fusionPathSegments[$numberOfFusionPathSegments - 4])
            && $fusionPathSegments[$numberOfFusionPathSegments - 4] === '__meta'
            && isset($fusionPathSegments[$numberOfFusionPathSegments - 3])
            && $fusionPathSegments[$numberOfFusionPathSegments - 3] === 'process') {

            // cut off the EXTENDED processing syntax "__meta/process/contentElementWrapping/expression<Neos.Neos:ContentElementWrapping>"
            return implode('/', array_slice($fusionPathSegments, 0, -4));
        }

        return $fusionPath;
    }
}
