<?php
namespace Neos\Neos\Ui\Fusion\Helper;

/*                                                                        *
 * This script belongs to the Neos Flow package "Neos.Neos.Ui".           *
 *                                                                        *
 *                                                                        */

use Neos\Flow\Annotations as Flow;
use Neos\Flow\Security\Authorization\PrivilegeManagerInterface;
use Neos\Eel\ProtectedContextAwareInterface;
use Neos\Utility\Arrays;
use Neos\Neos\Security\Authorization\Privilege\ModulePrivilege;
use Neos\Neos\Security\Authorization\Privilege\ModulePrivilegeSubject;

class ModulesHelper implements ProtectedContextAwareInterface
{
    /**
     * @var PrivilegeManagerInterface
     * @Flow\Inject
     */
    protected $privilegeManager;

    /**
     * @Flow\InjectConfiguration(path="modules", package="Neos.Neos")
     * @var array
     */
    protected $modules;

    /**
     * Checks whether a module is enabled
     *
     * @param string $modulePath
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
    public function isAllowed($modulePath)
    {
        $modulePathSegments = explode('/', $modulePath);
        $moduleConfiguration = Arrays::getValueByPath($this->modules, implode('.submodules.', $modulePathSegments));

        if (!$this->privilegeManager->isGranted(ModulePrivilege::class, new ModulePrivilegeSubject($modulePath))) {
            return false;
        }

        // @deprecated since Neos 3.2, use the ModulePrivilegeTarget instead!
        if (isset($moduleConfiguration['privilegeTarget']) && !$this->privilegeManager->isPrivilegeTargetGranted($moduleConfiguration['privilegeTarget'])) {
            return false;
        }

        return true;
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
