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

namespace Neos\TestNodeTypes\Application\RemoveAdditionalSettings;

use Neos\Flow\Annotations as Flow;
use Neos\Flow\Cache\CacheManager;
use Neos\Flow\Core\Bootstrap;
use Neos\Utility\Files;

#[Flow\Scope("singleton")]
final class RemoveAdditionalSettingsCommandHandler
{
    #[Flow\Inject]
    protected Bootstrap $bootstrap;

    public function handle(RemoveAdditionalSettingsCommand $command): void
    {
        $additionalSettingsFileName = Files::concatenatePaths([
            FLOW_PATH_CONFIGURATION,
            'Settings.Additional.yaml'
        ]);

        if (file_exists($additionalSettingsFileName)) {
            unlink($additionalSettingsFileName);
            $dispatcher = $this->bootstrap->getSignalSlotDispatcher();
            $dispatcher->connect(Bootstrap::class, 'bootstrapShuttingDown', function () {
                $this->bootstrap->getObjectManager()->get(CacheManager::class)->flushCaches();
            });
        }
    }
}
