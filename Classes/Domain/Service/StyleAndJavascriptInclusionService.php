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
use Neos\Flow\ResourceManagement\ResourceManager;
use Neos\Utility\PositionalArraySorter;

/**
 * @Flow\Scope("singleton")
 */
class StyleAndJavascriptInclusionService
{
    /**
     * @Flow\Inject
     * @var ResourceManager
     */
    protected $resourceManager;

    /**
     * @Flow\Inject(lazy=false)
     * @var CompilingEvaluator
     */
    protected $eelEvaluator;

    /**
     * @Flow\InjectConfiguration(package="Neos.Fusion", path="defaultContext")
     * @var array<string, string>
     */
    protected $fusionDefaultEelContext;

    /**
     * @Flow\InjectConfiguration(path="configurationDefaultEelContext")
     * @var array<string, string>
     */
    protected $additionalEelDefaultContext;

    /**
     * @Flow\InjectConfiguration(path="resources.javascript")
     * @var array<string, array{resource: string, attributes: array<string, mixed>, position: string}>
     */
    protected $javascriptResources;

    /**
     * @Flow\InjectConfiguration(path="resources.stylesheets")
     * @var array<string, array{resource: string, attributes: array<string, mixed>, position: string}>
     */
    protected $stylesheetResources;

    public function getHeadScripts(): string
    {
        return $this->build($this->javascriptResources, function ($uri, $additionalAttributes) {
            return '<script src="' . $uri . '" ' . $additionalAttributes . '></script>';
        });
    }

    public function getHeadStylesheets(): string
    {
        return $this->build($this->stylesheetResources, function ($uri, $additionalAttributes) {
            return '<link rel="stylesheet" href="' . $uri . '" ' . $additionalAttributes . '/>';
        });
    }

    /**
     * @param array<string, array{resource: string, attributes: array<string, mixed>}> $resourceArrayToSort
     */
    protected function build(array $resourceArrayToSort, \Closure $builderForLine): string
    {
        $sortedResources = (new PositionalArraySorter($resourceArrayToSort))->toArray();

        $result = '';
        foreach ($sortedResources as $element) {
            $resourceExpression = $element['resource'];
            if (substr($resourceExpression, 0, 2) === '${' && substr($resourceExpression, -1) === '}') {
                $resourceExpression = Utility::evaluateEelExpression(
                    $resourceExpression,
                    $this->eelEvaluator,
                    [],
                    array_merge($this->fusionDefaultEelContext, $this->additionalEelDefaultContext)
                );
            }

            $hash = null;

            if (strpos($resourceExpression, 'resource://') === 0) {
                // Cache breaker
                $hash = substr(md5_file($resourceExpression) ?: '', 0, 8);
                $resourceExpression = $this->resourceManager->getPublicPackageResourceUriByPath($resourceExpression);
            }
            $finalUri = $hash ? $resourceExpression . '?' . $hash : $resourceExpression;
            $additionalAttributes = array_merge(
                // legacy first level 'defer' attribute
                isset($element['defer']) ? ['defer' => $element['defer']] : [],
                $element['attributes'] ?? []
            );
            $result .= $builderForLine($finalUri, $this->htmlAttributesArrayToString($additionalAttributes));
        }
        return $result;
    }

    /**
     * @todo use helper like https://github.com/mficzel/neos-development-collection/blob/75e1feaed2e290b1d2ee3e500b82da42c3460aba/Neos.Fusion/Classes/Service/RenderAttributesTrait.php#L19 once its api
     *
     * @param array<string,string|bool> $attributes
     */
    private function htmlAttributesArrayToString(array $attributes): string
    {
        return join(' ', array_filter(array_map(function ($key, $value) {
            if (is_bool($value)) {
                return $value ? htmlspecialchars($key) : null;
            }
            return htmlspecialchars($key) . '="' . htmlspecialchars($value) . '"';
        }, array_keys($attributes), $attributes)));
    }
}
