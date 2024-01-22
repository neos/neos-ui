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

namespace Neos\Neos\Ui\Domain;

use Neos\Flow\Mvc\Routing\UriBuilder;

/**
 * Retrieves routes/endpoints required for communication with the
 * Neos server application.
 *
 * Only exceptions are `nodeTypeSchema` and `translations`,
 * which are handled by {@see ConfigurationProviderInterface}.
 *
 * @internal
 */
interface RoutesProviderInterface
{
    /** @return array<mixed> */
    public function getRoutes(UriBuilder $uriBuilder): array;
}
