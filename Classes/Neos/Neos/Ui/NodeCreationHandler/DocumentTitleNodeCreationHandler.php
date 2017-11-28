<?php

namespace Neos\Neos\Ui\NodeCreationHandler;

use Neos\Flow\Annotations as Flow;
use Neos\ContentRepository\Domain\Model\NodeInterface;
use Neos\Neos\Utility\NodeUriPathSegmentGenerator;

class DocumentTitleNodeCreationHandler implements NodeCreationHandlerInterface
{
    /**
     * @Flow\Inject
     * @var NodeUriPathSegmentGenerator
     */
    protected $nodeUriPathSegmentGenerator;

    /**
     * Set the node title for the newly created Document node
     *
     * @param NodeInterface $node The newly created node
     * @param array $data incoming data from the creationDialog
     * @return void
     */
    public function handle(NodeInterface $node, array $data)
    {
        if ($node->getNodeType()->isOfType('Neos.Neos:Document')) {
            if (isset($data['title'])) {
                $node->setProperty('title', $data['title']);
            }
            $node->setProperty('uriPathSegment', $this->nodeUriPathSegmentGenerator->generateUriPathSegment($node, (isset($data['title']) ? $data['title'] : null)));
        }
    }
}
