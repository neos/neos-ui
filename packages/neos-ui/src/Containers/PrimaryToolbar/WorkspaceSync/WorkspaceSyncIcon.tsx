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
import cx from 'classnames';

import {Icon} from '@neos-project/react-ui-components';

import style from './style.module.css';

export const WorkspaceSyncIcon: React.FC<{
    hasProblem?: boolean;
    onDarkBackground?: boolean;
}> = ({hasProblem, onDarkBackground}) => {
    const iconBadgeClassNames = cx({
        [style.badgeIconBackground]: typeof onDarkBackground === 'undefined' || onDarkBackground === false,
        [style.badgeIconOnDarkBackground]: onDarkBackground === true,
        'fa-layers-counter': true,
        'fa-layers-bottom-right': true,
        'fa-2x': true
    });
    const iconLayerClassNames = cx({
        [style.iconLayer]: true,
        'fa-layers': true,
        'fa-fw': true
    });
    const iconBadge = hasProblem ? (
        <span className={iconBadgeClassNames}>
            <Icon icon="exclamation"/>
        </span>
    ) : null

    return (
        <span className={iconLayerClassNames}>
            <Icon icon="sync" size="sm"/>
            {iconBadge}
        </span>
    )
}
