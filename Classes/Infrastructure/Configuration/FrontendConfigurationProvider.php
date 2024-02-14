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

use Neos\Flow\Annotations as Flow;
use Neos\Flow\Mvc\ActionRequest;
use Neos\Neos\Ui\Domain\InitialData\FrontendConfigurationProviderInterface;
use Neos\Neos\Ui\Domain\Service\ConfigurationRenderingService;

/**
 * @internal
 */
#[Flow\Scope("singleton")]
final class FrontendConfigurationProvider implements FrontendConfigurationProviderInterface
{
    #[Flow\Inject]
    protected ConfigurationRenderingService $configurationRenderingService;

    /** @var array<mixed> */
    #[Flow\InjectConfiguration('frontendConfiguration')]
    protected array $frontendConfigurationBeforeProcessing;

    public function getFrontendConfiguration(
        ActionRequest $actionRequest
    ): array {
        return $this->configurationRenderingService->computeConfiguration(
            $this->frontendConfigurationBeforeProcessing,
            ['request' => $actionRequest]
        );
    }
}
