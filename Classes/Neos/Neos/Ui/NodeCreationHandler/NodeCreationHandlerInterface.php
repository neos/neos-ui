<?php
namespace Neos\Neos\Ui\NodeCreationHandler;

use Neos\ContentRepository\Domain\Model\NodeInterface;

/**
 * NodeTypePostprocessorInterface
 */
interface NodeCreationHandlerInterface
{
    /**
     * Do something with the newly created node
     *
     * @param NodeInterface $node The newly created node
     * @param array $data incoming data from the creationDialog
     * @return void
     */
    public function handle(NodeInterface $node, array $data);
}
