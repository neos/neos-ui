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

namespace Neos\Neos\Ui\Infrastructure\MVC;

use Neos\Flow\Annotations as Flow;
use Neos\Flow\Mvc\Routing\UriBuilder;

/**
 * @internal
 */
#[Flow\Proxy(false)]
final class RoutesProviderHelper
{
    public function __construct(
        private readonly UriBuilder $uriBuilder,
    ) {
    }

    public function buildUiServiceRoute(string $actionName): string
    {
        return $this->uriBuilder->reset()
            ->setCreateAbsoluteUri(true)
            ->uriFor(
                actionName: $actionName,
                controllerArguments: [],
                controllerName: 'BackendService',
                packageKey: 'Neos.Neos.Ui',
            );
    }

    /**
     * @param array<string,mixed> $arguments
     */
    public function buildCoreRoute(
        string $controllerName,
        string $actionName,
        ?string $subPackageKey = null,
        ?string $format = null,
        array $arguments = [],
    ): string {
        $this->uriBuilder->reset()
            ->setCreateAbsoluteUri(true);

        if ($format !== null) {
            $this->uriBuilder->setFormat($format);
        }

        return $this->uriBuilder->uriFor(
            actionName: $actionName,
            controllerArguments: $arguments,
            controllerName: $controllerName,
            packageKey: 'Neos.Neos',
            subPackageKey: $subPackageKey,
        );
    }
}
