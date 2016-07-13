<?php
namespace Neos\Neos\Ui\TypoScript\Helper;

use TYPO3\Eel\ProtectedContextAwareInterface;
use TYPO3\Flow\Annotations as Flow;
use TYPO3\Flow\Session\SessionInterface;

class ActivationHelper implements ProtectedContextAwareInterface
{


    /**
     * @Flow\Inject
     * @var SessionInterface
     */
    protected $session;


    public function enableNewBackend()
    {
        return $this->session->isStarted() && $this->session->getData('__neosEnabled__');
    }

    /**
     * @param string $methodName
     * @return boolean
     */
    public function allowsCallOfMethod($methodName)
    {
        return true;
    }
}
