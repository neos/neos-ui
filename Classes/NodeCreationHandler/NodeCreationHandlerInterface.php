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

use Neos\ContentRepository\Core\Factory\ContentRepositoryServiceInterface;

/**
 * Contract for Node Creation handler that allow to hook into the process just before a node is being added
 * via the Neos UI
 * @api
 */
interface NodeCreationHandlerInterface extends ContentRepositoryServiceInterface
{
    /**
     * You can "enrich" the node creation, by for example adding initial properties {@see NodeCreationCommands::withInitialPropertyValues()}
     * or appending additional f.x. create-child nodes commands {@see NodeCreationCommands::withAdditionalCommands()}
     *
     * @param NodeCreationCommands $commands original or previous commands, with the first command being the initial intended node creation
     * @param NodeCreationElements $elements incoming data from the creationDialog
     * @return NodeCreationCommands the "enriched" commands, to be passed to the next handler or run at the end
     */
    public function handle(NodeCreationCommands $commands, NodeCreationElements $elements): NodeCreationCommands;
}
