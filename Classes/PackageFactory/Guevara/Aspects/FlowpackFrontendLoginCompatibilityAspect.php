<?php
namespace PackageFactory\Guevara\Aspects;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "PackageFactory.Guevara".*
 *                                                                        *
 *                                                                        */

use TYPO3\Flow\Annotations as Flow;
use TYPO3\FLOW\AOP\JoinPointInterface;
use Flowpack\Neos\FrontendLogin\Security\NeosRequestPattern;

/**
 * @TODO !!! Remove this, when there's a better way to achieve compatibility
 *
 * This Aspect helps us to get around compatibility issues with the Flowpack.Neos.FrontendLogin package. The background
 * is a RequestPattern that is applied via that package.
 *
 * This request pattern tries to distinguish between frontend and backend routes, but only matches backend routes that
 * start with '/neos'.
 *
 * With this aspect the behavior is enhanced to consider routes starting with '/che!' as well.
 *
 * It is important to find a better way to support Flowpack.Neos.FrontendLogin, since PackageFactory.Guevara should not
 * have a dependency to it. Therefore this aspect avoids a direct dependency, it is still implicit though.
 *
 * @Flow\Scope("singleton")
 * @Flow\Aspect
 */
class FlowpackFrontendLoginCompatibilityAspect
{

    /**
     * @Flow\Around("method(Flowpack\Neos\FrontendLogin\Security\NeosRequestPattern->matchRequest())")
     * @param JoinPointInterface $joinPoint
     * @return boolean
     */
    public function enhanceMatchRequest(JoinPointInterface $joinPoint)
    {
        $request = $joinPoint->getMethodArgument('request');
        $requestPath = $request->getHttpRequest()->getUri()->getPath();

        if ($joinPoint->getProxy()->getPattern() === NeosRequestPattern::PATTERN_BACKEND) {
            if (strpos($requestPath, '/che!') === 0) {
                return true;
            }
        }

        return $joinPoint->getAdviceChain()->proceed($joinPoint);
    }
}
