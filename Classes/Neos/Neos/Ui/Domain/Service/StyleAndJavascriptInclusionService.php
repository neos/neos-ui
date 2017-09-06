<?php

namespace Neos\Neos\Ui\Domain\Service;

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
     * @Flow\InjectConfiguration(path="state.defaultEelContext")
     * @var array
     */
    protected $defaultContext;


    /**
     * @Flow\InjectConfiguration(path="resources.javascript")
     * @var array
     */
    protected $javascriptResources;

    /**
     * @Flow\InjectConfiguration(path="resources.stylesheets")
     * @var array
     */
    protected $stylesheetResources;


    public function getHeadScripts()
    {
        return $this->build($this->javascriptResources, function($uri) {
            return '<script src="' . $uri . '"></script>';
        });
    }

    public function getHeadStylesheets()
    {
        return $this->build($this->stylesheetResources, function($uri) {
            return '<link rel="stylesheet" href="' . $uri . '" />';
        });
    }

    protected function build(array $resourceArrayToSort, \Closure $builderForLine)
    {
        $sortedResources = (new PositionalArraySorter($resourceArrayToSort))->toArray();

        $result = '';
        foreach ($sortedResources as $element) {
            $resourceExpression = $element['resource'];
            if (substr($resourceExpression, 0, 2) === '${' && substr($resourceExpression, -1) === '}') {
                $resourceExpression = Utility::evaluateEelExpression($resourceExpression, $this->eelEvaluator, [], $this->defaultContext);
            }

            if (strpos($resourceExpression, 'resource://') === 0) {
                $resourceExpression = $this->resourceManager->getPublicPackageResourceUriByPath($resourceExpression);
            }

            $result .= $builderForLine($resourceExpression);
        }

        return $result;
    }
}
