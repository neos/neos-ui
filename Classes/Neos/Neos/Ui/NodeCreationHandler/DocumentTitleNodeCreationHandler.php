<?php
namespace Neos\Neos\Ui\NodeCreationHandler;

use Neos\Flow\Annotations as Flow;
use Neos\ContentRepository\Domain\Model\NodeInterface;
use Neos\ContentRepository\Utility as NodeUtility;
use Neos\Neos\Ui\NodeCreationHandler\NodeCreationHandlerInterface;

class DocumentTitleNodeCreationHandler implements NodeCreationHandlerInterface
{
    /**
     * Set the node title for the newly created Document node
     *
     * @param NodeInterface $node The newly created node
     * @param array $data incoming data from the creationDialog
     * @return void
     */
    public function handle(NodeInterface $node, array $data)
    {
        if(isset($data['title']) && $node->getNodeType()->isOfType('Neos.Neos:Document')) {
            $node->setProperty('title', $data['title']);
            $node->setProperty('uriPathSegment', NodeUtility::renderValidNodeName($data['title']));
        }
    }
}
