<?php
namespace PackageFactory\Guevara\TypoScript;

use TYPO3\Flow\Annotations as Flow;
use TYPO3\Flow\Property\PropertyMapper;
use TYPO3\Flow\Mvc\View\JsonView;
use TYPO3\TYPO3CR\Domain\Model\NodeInterface;
use TYPO3\TypoScript\TypoScriptObjects\AbstractTypoScriptObject;

class DocumentInformationImplementation extends AbstractTypoScriptObject
{
    /**
     * @Flow\Inject
     * @var PropertyMapper
     */
    protected $propertyMapper;

    /**
     * Renders information about a document node and all of its child nodes into json
     *
     * @return string
     */
    public function evaluate()
    {
        $node = $this->tsValue('node');

        $documentInformation = [
            'title' => $node->getProperty('title'),
            'contextPath' => $node->getContextPath(),
            'nodes' => $this->buildNodeInformation($node)
        ];

        $controllerContext = $this->tsRuntime->getControllerContext();
        $contentType = $controllerContext->getResponse()->getHeader('Content-Type');


        $jsonView = new JsonView();
        $jsonView->assign('value', $documentInformation);
        $jsonView->setControllerContext($controllerContext);

        $result = sprintf('<script>window[\'@PackageFactory.Guevara:DocumentInformation\']=%s</script>',
            $jsonView->render());

        $controllerContext->getResponse()->setHeader('Content-Type', $contentType);

        return $result;
    }

    /**
     * Extract all the information needed from the node
     *
     * @param NodeInterface $node
     * @param string $excludeType
     * @return void
     */
    protected function buildNodeInformation(NodeInterface $node, $excludeType = null)
    {
        if ($excludeType !== NULL && $node->getNodeType()->isOfType($excludeType)) {
            return [];
        }

        $nodeInformation = [
            'nodeType' => $node->getNodeType()->getName(),
            'contextPath' => $node->getContextPath(),
            'identifier' => $node->getIdentifier(),
            'properties' => $node->getProperties(),
            'children' => []
        ];

        $result = [];

        foreach ($node->getChildNodes() as $child) {
            $result = array_merge($result, $this->buildNodeInformation($child, 'TYPO3.Neos:Document'));
            $nodeInformation['children'][$child->getContextPath()] = $child->getContextPath();
        }

        $result = array_merge([
            $node->getContextPath() => $nodeInformation
        ], $result);

        return $result;
    }
}
