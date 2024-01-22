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

namespace Neos\Neos\Ui\Infrastructure\Configuration;

use Neos\ContentRepository\Core\ContentRepository;
use Neos\Flow\Annotations as Flow;
use Neos\Flow\Configuration\ConfigurationManager;
use Neos\Flow\Mvc\Routing\UriBuilder;
use Neos\Neos\Service\UserService;
use Neos\Neos\Ui\ContentRepository\Service\WorkspaceService;
use Neos\Neos\Ui\Domain\CacheConfigurationVersionProviderInterface;
use Neos\Neos\Ui\Domain\ConfigurationProviderInterface;

/**
 * @internal
 */
#[Flow\Scope("singleton")]
final class ConfigurationProvider implements ConfigurationProviderInterface
{
    #[Flow\Inject]
    protected UserService $userService;

    #[Flow\Inject]
    protected ConfigurationManager $configurationManager;

    #[Flow\Inject]
    protected WorkspaceService $workspaceService;

    #[Flow\Inject]
    protected CacheConfigurationVersionProviderInterface $cacheConfigurationVersionProvider;

    public function getConfiguration(
        ContentRepository $contentRepository,
        UriBuilder $uriBuilder,
    ): array {
        return [
            'nodeTree' => $this->configurationManager->getConfiguration(
                ConfigurationManager::CONFIGURATION_TYPE_SETTINGS,
                'Neos.Neos.userInterface.navigateComponent.nodeTree',
            ),
            'structureTree' => $this->configurationManager->getConfiguration(
                ConfigurationManager::CONFIGURATION_TYPE_SETTINGS,
                'Neos.Neos.userInterface.navigateComponent.structureTree',
            ),
            'allowedTargetWorkspaces' =>
                $this->workspaceService->getAllowedTargetWorkspaces(
                    $contentRepository
                ),
            'endpoints' => [
                'nodeTypeSchema' => $uriBuilder->reset()
                    ->setCreateAbsoluteUri(true)
                    ->uriFor(
                        actionName: 'nodeTypeSchema',
                        controllerArguments: [
                            'version' =>
                                $this->cacheConfigurationVersionProvider
                                    ->getCacheConfigurationVersion(),
                        ],
                        controllerName: 'Backend\\Schema',
                        packageKey: 'Neos.Neos',
                    ),
                'translations' => $uriBuilder->reset()
                    ->setCreateAbsoluteUri(true)
                    ->uriFor(
                        actionName: 'xliffAsJson',
                        controllerArguments: [
                            'locale' =>
                                $this->userService
                                    ->getInterfaceLanguage(),
                            'version' =>
                                $this->cacheConfigurationVersionProvider
                                    ->getCacheConfigurationVersion(),
                        ],
                        controllerName: 'Backend\\Backend',
                        packageKey: 'Neos.Neos',
                    ),
            ]
        ];
    }
}
