<?php

namespace Neos\Neos\Ui\Domain\Service;

use TYPO3\Eel\CompilingEvaluator;
use TYPO3\Eel\Utility;
use Neos\Flow\Annotations as Flow;


/**
 * @Flow\Scope("singleton")
 */
class StateRenderingService
{

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

    public function computeState(array $state, $context)
    {
        $adjustedState = $state;
        $this->computeStateInternally($adjustedState, $context);

        return $adjustedState;
    }

    protected function computeStateInternally(&$adjustedState, $context)
    {
        foreach ($adjustedState as $key => &$value) {
            if (is_array($value)) {
                $this->computeStateInternally($value, $context);
            } elseif (is_string($value) && substr($value, 0, 2) === '${' && substr($value, -1) === '}') {
                $value = Utility::evaluateEelExpression($value, $this->eelEvaluator, $context, $this->defaultContext);
            }
        }
    }
}