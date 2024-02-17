<?php
namespace Neos\Neos\Ui\Domain\NodeCreation;

/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

use Neos\ContentRepository\Core\Factory\ContentRepositoryServiceFactoryInterface;
use Neos\ContentRepository\Core\Factory\ContentRepositoryServiceInterface;

/**
 * Contract to hook into the process before the node creation command is handled by the content repository
 *
 * You can add additional steps to the node creation.
 * For example adding initial properties via {@see NodeCreationCommands::withInitialPropertyValues()},
 * or queuing additional commands like to create a child via {@see NodeCreationCommands::withAdditionalCommands()}
 *
 * The node creation handlers factory can be registered on a NodeType:
 *
 *     Vendor.Site:Content:
 *       options:
 *         nodeCreationHandlers:
 *           myHandler:
 *             factoryClassName: 'Vendor\Site\MyHandlerFactory'
 *             position: end
 *
 * The factory must implement the {@see ContentRepositoryServiceFactoryInterface} and
 * return an implementation with this {@see NodeCreationHandlerInterface} interface.
 *
 * The current content-repository or NodeType-manager will be accessible via the factory dependencies.
 *
 * @api
 */
interface NodeCreationHandlerInterface extends ContentRepositoryServiceInterface
{
    /**
     * @param NodeCreationCommands $commands original or previous commands,
     *                                       with the first command being the initial intended node creation
     * @param NodeCreationElements $elements incoming data from the creationDialog
     * @return NodeCreationCommands the enriched node creation commands,
     *                              to be passed to the next handler or run at the end
     */
    public function handle(NodeCreationCommands $commands, NodeCreationElements $elements): NodeCreationCommands;
}
