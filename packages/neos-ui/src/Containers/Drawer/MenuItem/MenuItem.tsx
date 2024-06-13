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

import {Icon, Button} from '@neos-project/react-ui-components';

import I18n from '@neos-project/neos-ui-i18n';

import style from '../style.module.css';

export const MenuItem: React.FC<{
    icon?: string;
    label: string;
    uri?: string;
    isActive: boolean;
    skipI18n?: boolean;
}> = (props) => {
    const {skipI18n, label, icon, uri} = props;

    return (
        <a href={uri}>
            <Button
                className={style.drawer__menuItemBtn}
                style="transparent"
                hoverStyle="clean"
                disabled={!uri}
                >
                {icon && <Icon icon={icon} padded="right"/>}
                {skipI18n ? label : <I18n id={label} fallback={label}/>}
            </Button>
        </a>
    );
}
