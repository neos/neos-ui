<?php
namespace Neos\Neos\Ui\Aspects;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Neos.Neos.Ui".*
 *                                                                        *
 *                                                                        */

use Neos\Flow\Annotations as Flow;
use TYPO3\FLOW\Aop\JoinPointInterface;
use Neos\Flow\Session\SessionInterface;
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
     * @Flow\Before("method(Neos\Neos\Controller\Backend\BackendController->indexAction())")
     * @param JoinPointInterface $joinPoint the join point
     * @return mixed
     */
    public function disableNewUserInterface(JoinPointInterface $joinPoint)
    {
        $this->contentCache->flush();
        $this->session->start();
        $this->session->putData('__neosEnabled__', false);
    }
}
