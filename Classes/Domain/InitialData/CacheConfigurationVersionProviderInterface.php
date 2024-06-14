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
 * Retrieves the current version identifier for the configuration cache so it
 * can be used as a cache busting parameter for resources fetched on client
 * side.
 *
 * @internal
 */
interface CacheConfigurationVersionProviderInterface
{
    public function getCacheConfigurationVersion(): string;
}
