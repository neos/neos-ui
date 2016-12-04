<?php
namespace Neos\Neos\Ui\TypoScript\Helper;

use Neos\Eel\ProtectedContextAwareInterface;
use Neos\Flow\Annotations as Flow;
use Neos\Flow\Session\SessionInterface;

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
