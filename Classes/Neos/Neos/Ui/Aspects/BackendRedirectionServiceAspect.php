<?php
namespace Neos\Neos\Ui\Aspects;

/*                                                                        *
 * This script belongs to the Neos Flow package "Neos.Neos.Ui".*
 *                                                                        *
 *                                                                        */

use Neos\Flow\Annotations as Flow;
use Neos\Flow\Aop\JoinPointInterface;
use Neos\Flow\Mvc\Routing\UriBuilder;
use Neos\Flow\Session\SessionInterface;
use Neos\Neos\Service\UserService;

/**
 * @Flow\Scope("singleton")
 * @Flow\Aspect
 */
class BackendRedirectionServiceAspect
{

    /**
     * @Flow\Inject
     * @var UserService
     */
    protected $userService;


    /**
     * @Flow\Inject
     * @var SessionInterface
     */
    protected $session;

    /**
     * @Flow\Around("method(Neos\Neos\Service\BackendRedirectionService->getAfterLoginRedirectionUri())")
     * @param JoinPointInterface $joinPoint the join point
     * @return mixed
     */
    public function getAfterLoginRedirectionUri(JoinPointInterface $joinPoint)
    {
        if (!$this->session->isStarted() || !$this->session->getData('__neosEnabled__')) {
            return $joinPoint->getAdviceChain()->proceed($joinPoint);
        } else {
            $actionRequest = $joinPoint->getMethodArgument('actionRequest');
            $uriBuilder = new UriBuilder();
            $uriBuilder->setRequest($actionRequest);
            $uriBuilder->setFormat('html');
            $uriBuilder->setCreateAbsoluteUri(true);

            return $uriBuilder->uriFor('index', [], 'Backend', 'Neos.Neos.Ui');
        }
    }
}
