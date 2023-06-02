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

use Neos\ContentRepository\Core\ContentRepository;

/**
 * Contract for Node Creation handler that allow to hook into the process just before a node is being added
 * via the Neos UI
 */
interface NodeCreationHandlerInterface
{
    /**
     * Do something with the newly created node
     *
     * @param NodeCreationCommands $commands original node creation command
     * @param array<string|int,mixed> $data incoming data from the creationDialog
     * @return NodeCreationCommands the original command (or with altered properties) with additional commands
     */
    public function handle(NodeCreationCommands $commands, array $data, ContentRepository $contentRepository): NodeCreationCommands;
}
