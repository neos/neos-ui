<?php
namespace Neos\Neos\Ui\TypoScript\Helper;

use TYPO3\Eel\ProtectedContextAwareInterface;
use TYPO3\Flow\Annotations as Flow;
use TYPO3\Flow\Session\SessionInterface;

class StaticResourcesHelper implements ProtectedContextAwareInterface
{


    /**
     * @Flow\InjectConfiguration("frontendDevelopmentMode")
     * @var boolean
     */
    protected $frontendDevelopmentMode;


    public function compiledResourcePackage()
    {
        if ($this->frontendDevelopmentMode) {
            return 'Neos.Neos.Ui';
        } else {
            return 'Neos.Neos.Ui.Compiled';
        }
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
