<?php

/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

declare(strict_types=1);

namespace Neos\Neos\Ui\Infrastructure\Neos;

use Neos\Flow\Annotations as Flow;
use Neos\Flow\Mvc\Controller\ControllerContext;
use Neos\Neos\Controller\Backend\MenuHelper;
use Neos\Neos\Ui\Domain\MenuProviderInterface;
use Neos\Utility\PositionalArraySorter;

#[Flow\Scope("singleton")]
final class MenuProvider implements MenuProviderInterface
{
    #[Flow\Inject]
    protected MenuHelper $menuHelper;

    public function getMenu(ControllerContext $controllerContext): array
    {
        $modulesForMenu = $this->menuHelper->buildModuleList($controllerContext);

        $result = [];
        foreach ($modulesForMenu as $moduleName => $module) {
            if ($module['hideInMenu'] === true) {
                continue;
            }

            $result[$moduleName]['label'] = $module['label'];
            $result[$moduleName]['icon'] = $module['icon'];
            $result[$moduleName]['uri'] = $module['uri'];
            $result[$moduleName]['target'] = 'Window';

            $result[$moduleName]['children'] = match ($module['module']) {
                'content' => $this->buildChildrenForSites($controllerContext),
                default => $this->buildChildrenForBackendModule($module),
            };
        }

        return array_values($result);
    }

    /**
     * @return array<int,array{icon:string,label:string,uri:string,isActive:bool,target:string,skipI18n:bool}>
     */
    private function buildChildrenForSites(ControllerContext $controllerContext): array
    {
        $sitesForMenu = $this->menuHelper->buildSiteList($controllerContext);

        $result = [];
        foreach ($sitesForMenu as $index => $site) {
            $name = $site['name'];
            $name = is_string($name) ? $name : 'N/A';

            $uri = $site['uri'];
            $uri = is_string($uri) ? $uri : '#';

            $active = $site['active'];
            $active = is_bool($active) || is_numeric($active)
                ? (bool) $active
                : false;

            $result[$index]['icon'] = 'globe';
            $result[$index]['label'] = $name;
            $result[$index]['uri'] = $uri;
            $result[$index]['target'] = 'Window';
            $result[$index]['isActive'] = $active;
            $result[$index]['skipI18n'] = true;
        }

        return array_values($result);
    }

    /**
     * @param array{submodules:array<string,array{hideInMenu:bool,icon:string,label:string,uri:string,position:string}>} $module
     * @return array<int,array{icon:string,label:string,uri:string,position:string,isActive:bool,target:string,skipI18n:bool}>
     */
    private function buildChildrenForBackendModule(array $module): array
    {
        $result = [];
        foreach ($module['submodules'] as $submoduleName => $submodule) {
            if ($submodule['hideInMenu'] === true) {
                continue;
            }

            $result[$submoduleName]['icon'] = $submodule['icon'];
            $result[$submoduleName]['label'] = $submodule['label'];
            $result[$submoduleName]['uri'] = $submodule['uri'];
            $result[$submoduleName]['position'] = $submodule['position'];
            $result[$submoduleName]['isActive'] = true;
            $result[$submoduleName]['target'] = 'Window';
            $result[$submoduleName]['skipI18n'] = false;
        }

        $positionalArraySorter = new PositionalArraySorter($result);
        $result = $positionalArraySorter->toArray();

        return array_values($result);
    }
}
