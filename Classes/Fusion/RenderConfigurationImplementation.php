<?php
namespace Neos\Neos\Ui\Fusion;

/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

use Neos\Flow\Annotations as Flow;
use Neos\Flow\Exception;
use Neos\Flow\Mvc\ActionRequest;
use Neos\Fusion\FusionObjects\AbstractFusionObject;
use Neos\Neos\Ui\Domain\Service\ConfigurationRenderingService;

/**
 * @internal
 */
class RenderConfigurationImplementation extends AbstractFusionObject
{
    /**
     * @Flow\Inject
     * @var ConfigurationRenderingService
     */
    protected $configurationRenderingService;

    /**
     * @Flow\InjectConfiguration()
     * @var array<string, mixed>
     */
    protected $settings;

    /**
     * @return array<string, mixed>
     */
    protected function getContext(): array
    {
        return $this->fusionValue('context');
    }

    /**
     * @return string
     */
    protected function getPath(): string
    {
        return $this->fusionValue('path');
    }

    /**
     * Appends an item to the given collection
     *
     * @return array<string|int, mixed>
     * @throws Exception
     */
    public function evaluate()
    {
        $context = $this->getContext();
        $pathToRender = $this->getPath();
        $actionRequest = $this->getRuntime()->fusionGlobals->get('request');
        if (!$actionRequest instanceof ActionRequest) {
            throw new Exception('The request is expected to be an ActionRequest.', 1706639436);
        }
        $context['request'] = $actionRequest;

        if (!isset($this->settings[$pathToRender])) {
            throw new Exception('The path "Neos.Neos.Ui.' . $pathToRender . '" was not found in the settings.', 1458814468);
        }

        return $this->configurationRenderingService->computeConfiguration($this->settings[$pathToRender], $context);
    }
}
