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
import {getVersion} from '@neos-project/utils-helpers';

import style from '../style.module.css';

const uiVersion = getVersion();
export const VersionPanel: React.FC = () => (
    <div className={style.drawer__version}>
        <div>UI version: {uiVersion}</div>
    </div>
);
