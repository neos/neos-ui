<?php
namespace Neos\Neos\Ui\TypoScript\Helper;

use Neos\Eel\ProtectedContextAwareInterface;
use Neos\Flow\Annotations as Flow;
use Neos\Flow\Session\SessionInterface;

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
