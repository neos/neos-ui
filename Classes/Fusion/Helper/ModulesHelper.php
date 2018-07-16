<?php
namespace Neos\Neos\Ui\Fusion\Helper;

/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

use Neos\Eel\ProtectedContextAwareInterface;
use Neos\Flow\Annotations as Flow;
use Neos\Flow\Security\Authorization\PrivilegeManagerInterface;
use Neos\Neos\Security\Authorization\Privilege\ModulePrivilege;
use Neos\Neos\Security\Authorization\Privilege\ModulePrivilegeSubject;
use Neos\Utility\Arrays;

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
