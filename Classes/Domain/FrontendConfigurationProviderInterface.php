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

use Neos\Flow\Mvc\Controller\ControllerContext;

/**
 * Reads and preprocesses the `Neos.Neos.Ui.frontendConfiguration` settings
 * that are mostly used by third-party plugins to share data between server
 * and client.
 *
 * @internal
 */
interface FrontendConfigurationProviderInterface
{
    /** @return array<mixed> */
    public function getFrontendConfiguration(
        ControllerContext $controllerContext
    ): array;
}
