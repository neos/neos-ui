<?php
namespace Neos\Neos\Ui\NodeCreationHandler;

/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

use Neos\ContentRepository\Domain\Model\NodeInterface;

class ContentTitleNodeCreationHandler implements NodeCreationHandlerInterface
{
    /**
     * Set the node title for the newly created Content node
     *
     * @param NodeInterface $node The newly created node
     * @param array $data incoming data from the creationDialog
     * @return void
     */
    public function handle(NodeInterface $node, array $data)
    {
        if ($node->getNodeType()->isOfType('Neos.Neos:Content')) {
            if (isset($data['title'])) {
                $node->setProperty('title', $data['title']);
            }
        }
    }
}
