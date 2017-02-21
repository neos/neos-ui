<?php
namespace Neos\Neos\Ui\Fusion\Helper;

/*                                                                        *
 * This script belongs to the Neos Flow package "Neos.Neos.Ui".           *
 *                                                                        *
 *                                                                        */

use Neos\Flow\Annotations as Flow;
use Neos\Flow\Security\Authorization\PrivilegeManagerInterface;
use Neos\Eel\ProtectedContextAwareInterface;

class ModulesHelper implements ProtectedContextAwareInterface
{
    /**
     * @var PrivilegeManagerInterface
     * @Flow\Inject
     */
    protected $privilegeManager;

    /**
     * @Flow\InjectConfiguration(path="Neos.Neos.modules")
     * @var array
     */
    protected $modules;

    /**
     * Checks whether a module is enabled
     *
     * @param strin $modulePath
     * @return boolean
     */
    public function isEnabled($modulePath)
    {
        $modulePathSegments = explode('/', $modulePath);
        $moduleConfiguration = Arrays::getValueByPath($this->modules, implode('.submodules.', $modulePathSegments));

        if (isset($moduleConfiguration['enabled']) && $moduleConfiguration['enabled'] !== true) {
            return false;
        }
        
        array_pop($modulePathSegments);

        if ($modulePathSegments === []) {
            return true;
        }

        return $this->isEnabled(implode('/', $modulePathSegments));
    }

    /**
     * Checks whether the current user has access to a module
     *
     * @param string $modulePath
     * @return boolean
     */
    public function isAllowed($moduleName)
    {
        $moduleConfiguration = $this->modules[$moduleName];
        if (
            isset($moduleConfiguration['privilegeTarget']) &&
            !$this->privilegeManager->isPrivilegeTargetGranted($moduleConfiguration['privilegeTarget'])
        ) {
            return true;
        }

        return false;
    }

    /**
     * Checks, whether a module is available to the current user
     *
     * @param  string $moduleName
     * @return boolean
     */
    public function isAvailable($moduleName)
    {
        return $this->isEnabled($moduleName) && $this->isAllowed($moduleName);
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
