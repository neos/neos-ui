<?php
namespace PackageFactory\Guevara\Aspects;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "PackageFactory.Guevara".*
 *                                                                        *
 *                                                                        */

use TYPO3\Flow\Annotations as Flow;
use TYPO3\FLOW\AOP\JoinPointInterface;
use TYPO3\Neos\Service\HtmlAugmenter;

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
     * @var HtmlAugmenter
     */
    protected $htmlAugmenter;

    /**
     * Hooks into standard content element wrapping to render those attributes needed for Guevara to identify
     * nodes and typoScript paths
     *
     * @Flow\Around("method(TYPO3\Neos\Service\ContentElementWrappingService->wrapContentObject())")
     * @param JoinPointInterface $joinPoint the join point
     * @return mixed
     */
    public function contentElementAugmentation(JoinPointInterface $joinPoint)
    {
        $node = $joinPoint->getMethodArgument('node');
        $content = $joinPoint->getMethodArgument('content');
        $typoScriptPath = $joinPoint->getMethodArgument('typoScriptPath');

        $attributes = [
            'data-__che-node-identifier' => $node->getIdentifier(),
            'data-__che-typoscript-path' => $typoScriptPath
        ];

        return $this->htmlAugmenter->addAttributes($content, $attributes, 'div');
    }

    /**
     * Hooks into the editable viewhelper to render those attributes needed for Guevara's inline editing
     *
     * @Flow\Around("method(TYPO3\Neos\ViewHelpers\ContentElement\EditableViewHelper->render())")
     * @param JoinPointInterface $joinPoint the join point
     * @return mixed
     */
    public function editableElementAugmentation(JoinPointInterface $joinPoint) {
        $property = $joinPoint->getMethodArgument('property');
        $tag = $joinPoint->getMethodArgument('tag');
        $node = $joinPoint->getMethodArgument('node');

        $content = $joinPoint->getAdviceChain()->proceed($joinPoint);

        $attributes = [
            'data-__che-property' => $property
        ];

        if ($node !== NULL) {
            $attributes += [
                'data-__che-node-identifier' => $node->getIdentifier()
            ];
        }

        return $this->htmlAugmenter->addAttributes($content, $attributes, $tag);
    }

}
