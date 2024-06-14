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

namespace Neos\Neos\Ui\Domain\InitialData;

use Neos\Flow\Mvc\ActionRequest;

/**
 * Retrieves all data needed to render the main burger menu located in the
 * top left corner of the UI.
 *
 * @internal
 */
interface MenuProviderInterface
{
    /**
     * @return array<int,array{label:string,icon:string,uri:string,target:string,children:array<int,array{icon:string,label:string,uri:string,position?:string,isActive:bool,target:string,skipI18n:bool}>}>
     */
    public function getMenu(ActionRequest $actionRequest): array;
}
