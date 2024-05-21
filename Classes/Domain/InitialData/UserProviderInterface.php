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

/**
 * Retrieves all data needed to render the user panel at the bottom
 * of the drawer menu
 *
 * @internal
 */
interface UserProviderInterface
{
    /**
     * @return array{name:array{title:string,firstName:string,middleName:string,lastName:string,otherName:string,fullName:string},preferences:array{interfaceLanguage:null|string}}
     */
    public function getUser(): ?array;
}
