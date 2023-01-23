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

namespace Neos\Neos\Ui;

use Neos\Flow\Core\Bootstrap;
use Neos\Flow\Mvc;
use Neos\Flow\Package\Package as BasePackage;
use Neos\Neos\Ui\Application\UiApi;

final class Package extends BasePackage
{
    public function boot(Bootstrap $bootstrap)
    {
        $dispatcher = $bootstrap->getSignalSlotDispatcher();

        $dispatcher->connect(
            Mvc\Dispatcher::class,
            'afterControllerInvocation',
            function () use ($bootstrap) {
                if ($bootstrap->getObjectManager()->has(UiApi::class)) {
                    $api = $bootstrap->getObjectManager()->get(UiApi::class);
                    $api->flush();
                }
            }
        );
    }
}
