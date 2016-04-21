<?php
namespace PackageFactory\Guevara\Aspects;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "PackageFactory.Guevara".*
 *                                                                        *
 *                                                                        */

use TYPO3\Flow\Annotations as Flow;
use TYPO3\FLOW\AOP\JoinPointInterface;
use TYPO3\Flow\Session\SessionInterface;
use TYPO3\TypoScript\Core\Cache\ContentCache;

/**
 * @Flow\Scope("singleton")
 * @Flow\Aspect
 */
class ActivationAspect
{

    /**
     * @Flow\Inject
     * @var SessionInterface
     */
    protected $session;

    /**
     * @Flow\Inject
     * @var ContentCache
     */
    protected $contentCache;

    /**
     * @Flow\Before("method(TYPO3\Neos\Controller\Backend\BackendController->indexAction())")
     * @param JoinPointInterface $joinPoint the join point
     * @return mixed
     */
    public function disableNewUserInterface(JoinPointInterface $joinPoint)
    {
        $this->contentCache->flush();
        $this->session->start();
        $this->session->putData('__cheEnabled__', false);
    }
}
