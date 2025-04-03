<?php

/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

declare(strict_types=1);

namespace Neos\Neos\Ui\Domain\InitialData;

/**
 * Retrieves information about node type roles and node type groups.
 *
 * Roles are a dedicated UI-concept that is meant to distinguish between
 * document, content and collection nodes.
 * Groups refer the grouping of node types in the creation dialog.
 *
 * @internal
 */
interface NodeTypeGroupsAndRolesProviderInterface
{
    /**
     * @return array{roles:mixed,groups:mixed}
     */
    public function getNodeTypes(): array;
}
