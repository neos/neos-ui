<?php
namespace PackageFactory\Guevara\TypoScript\Helper;

use TYPO3\Flow\Annotations as Flow;
use TYPO3\Eel\ProtectedContextAwareInterface;
use TYPO3\Flow\Mvc\Controller\ControllerContext;
use TYPO3\Neos\Service\LinkingService;
use TYPO3\TYPO3CR\Domain\Model\Node;
use TYPO3\TYPO3CR\Domain\Model\NodeInterface;

class NodeInfoHelper implements ProtectedContextAwareInterface
{

    /**
     * @Flow\Inject
     * @var LinkingService
     */
    protected $linkingService;

    private function renderNode(NodeInterface $node, ControllerContext $controllerContext)
    {
        $nodeInfo = [
            'contextPath' => $node->getContextPath(),
            'name' => $node->getName(),
            'identifier' => $node->getIdentifier(),
            'nodeType' => $node->getNodeType()->getName(),
            'properties' => $node->getProperties(), // TODO
            'label' => $node->getLabel(),
            'isAutoCreated' => $node->isAutoCreated(),
            // TODO: 'uri' =>@if.onyRenderWhenNodeIsADocument = ${q(node).is('[instanceof TYPO3.Neos:Document]')}
            'children' => [],
        ];
        if ($node->getNodeType()->isOfType('TYPO3.Neos:Document')) {
            $nodeInfo['uri'] = $this->uri($node, $controllerContext);
        }

        foreach ($node->getChildNodes() as $childNode) {
            /* @var NodeInterface $childNode */
            $nodeInfo['children'][] = [
                'contextPath' => $childNode->getContextPath(),
                'nodeType' => $childNode->getNodeType()->getName() // TODO: DUPLICATED; should NOT be needed!!!
            ];
        }

        return $nodeInfo;
    }

    protected function renderNodeToList(&$nodes, NodeInterface $node, ControllerContext $controllerContext)
    {
        $nodes[$node->getContextPath()] = $this->renderNode($node, $controllerContext);
    }

    public function renderDocumentNodeAndChildContent(NodeInterface $documentNode, ControllerContext $controllerContext)
    {
        $nodes = [];
        $this->renderDocumentNodeAndChildContentInternal($nodes, $documentNode, $controllerContext);
        return $nodes;
    }

    protected function renderDocumentNodeAndChildContentInternal(array &$nodes, NodeInterface $node, ControllerContext $controllerContext)
    {
        $this->renderNodeToList($nodes, $node, $controllerContext);
        foreach ($node->getChildNodes('!TYPO3.Neos:Document') as $childNode) {
            $this->renderDocumentNodeAndChildContentInternal($nodes, $childNode, $controllerContext);
        }
    }

    public function defaultNodesForBackend(NodeInterface $site, NodeInterface $documentNode, ControllerContext $controllerContext)
    {
        $nodes = [];
        if ($site !== $documentNode) {
            $this->renderNodeToList($nodes, $site, $controllerContext);
        }
        foreach ($site->getChildNodes('TYPO3.Neos:Document') as $documentChildNodeInFirstLevel) {
            $this->renderNodeToList($nodes, $documentChildNodeInFirstLevel, $controllerContext);
        }

        $this->renderNodeToList($nodes, $documentNode, $controllerContext);

        return $nodes;
    }

    public function uri(NodeInterface $node, ControllerContext $controllerContext)
    {
        return $this->linkingService->createNodeUri($controllerContext, $node);
    }

    /**
     * @param string $methodName
     * @return boolean
     */
    public function allowsCallOfMethod($methodName)
    {
        return true;
    }
}
