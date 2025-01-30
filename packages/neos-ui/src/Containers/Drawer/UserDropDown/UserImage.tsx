/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */
import React from 'react';

import style from './style.module.css';

export const UserImage: React.FC<{
    userFirstName: string;
    userLastName: string;
}> = (props) => {
    const userInitials = props.userFirstName?.charAt(0) + props.userLastName?.charAt(0);

    return (
        <div className={style.user__image}>{userInitials}</div>
    );
}
