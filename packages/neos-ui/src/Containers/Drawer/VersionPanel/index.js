import React, {PureComponent} from 'react';
import {getVersion} from '@neos-project/utils-helpers';

import style from '../style.css';

export default class VersionPanel extends PureComponent {
    render() {
        // Current version to enhance bugreports
        const uiVersion = getVersion();

        return (
            <div className={style.drawer__version}>
                <div>UI version: {uiVersion}</div>
            </div>
        );
    }
}
