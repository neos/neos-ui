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

namespace Neos\TestNodeTypes\Application\WriteAdditionalSettings;

use DirectoryIterator;
use Neos\Flow\Annotations as Flow;
use Neos\Flow\Cache\CacheManager;
use Neos\Flow\Configuration\Source\YamlSource;
use Neos\Flow\Core\Bootstrap;
use Neos\Utility\Files;

#[Flow\Scope("singleton")]
final class WriteAdditionalSettingsCommandHandler
{
    #[Flow\Inject]
    protected YamlSource $yamlConfigurationSource;

    #[Flow\Inject]
    protected Bootstrap $bootstrap;

    public function handle(WriteAdditionalSettingsCommand $command): void
    {
        $this->yamlConfigurationSource->save(
            Files::concatenatePaths([
                FLOW_PATH_CONFIGURATION,
                'Settings.Additional'
            ]),
            $command->settings
        );

        $dispatcher = $this->bootstrap->getSignalSlotDispatcher();
        $dispatcher->connect(Bootstrap::class, 'bootstrapShuttingDown', function () {
            $this->bootstrap->getObjectManager()->get(CacheManager::class)->flushCaches();
        });
    }
}
