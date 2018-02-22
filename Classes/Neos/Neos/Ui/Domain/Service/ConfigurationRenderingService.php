<?php
namespace Neos\Neos\Ui\Domain\Service;

/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

use Neos\Eel\CompilingEvaluator;
use Neos\Eel\Utility;
use Neos\Flow\Annotations as Flow;

/**
 * @Flow\Scope("singleton")
 */
class ConfigurationRenderingService
{

    /**
     * @Flow\Inject(lazy=false)
     * @var CompilingEvaluator
     */
    protected $eelEvaluator;

    /**
     * @Flow\InjectConfiguration(path="configurationDefaultEelContext")
     * @var array
     */
    protected $defaultContext;

    public function computeConfiguration(array $configuration, $context)
    {
        $adjustedConfiguration = $configuration;
        $this->computeConfigurationInternally($adjustedConfiguration, $context);

        return $adjustedConfiguration;
    }

    protected function computeConfigurationInternally(&$adjustedConfiguration, $context)
    {
        foreach ($adjustedConfiguration as $key => &$value) {
            if (is_array($value)) {
                $this->computeConfigurationInternally($value, $context);
            } elseif (is_string($value) && substr($value, 0, 2) === '${' && substr($value, -1) === '}') {
                $value = Utility::evaluateEelExpression($value, $this->eelEvaluator, $context, $this->defaultContext);
            }
        }
    }
}
