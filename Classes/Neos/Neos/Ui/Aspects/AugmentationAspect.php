<?php
namespace Neos\Neos\Ui\Aspects;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Neos.Neos.Ui".          *
 *                                                                        *
 *                                                                        */

use Neos\ContentRepository\Domain\Model\NodeInterface;
use Neos\ContentRepository\Service\AuthorizationService;
use Neos\Flow\Annotations as Flow;
use Neos\Flow\Aop\JoinPointInterface;
use Neos\Flow\Session\SessionInterface;
use Neos\Neos\Domain\Service\ContentContext;
use Neos\Neos\Service\HtmlAugmenter;

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
     * @var SessionInterface
     */
    protected $session;

    /**
     * Hooks into standard content element wrapping to render those attributes needed for the package to identify
     * nodes and typoScript paths
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
        $fusionPath = $joinPoint->getMethodArgument('typoScriptPath');

        if (!$this->needsMetadata($node, false)) {
            return $content;
        }

        $attributes = [
            'data-__neos-node-contextpath' => $node->getContextPath(),
            'data-__neos-fusion-path' => $fusionPath
        ];

        return $this->htmlAugmenter->addAttributes($content, $attributes, 'div');
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
            'data-__neos-property' => $property
        ];

        if ($node !== null) {
            $attributes += [
                'data-__neos-editable-node-contextpath' => $node->getContextPath()
            ];
        }

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

}
