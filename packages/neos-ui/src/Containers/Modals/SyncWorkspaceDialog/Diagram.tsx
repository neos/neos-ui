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
import {SyncingPhase} from '@neos-project/neos-ui-redux-store/src/CR/Syncing';

import style from './style.module.css';

export const Diagram: React.FC<{
    phase: SyncingPhase;
    workspaceName: string;
    baseWorkspaceName: string;
}> = (props) => {
    return (
        <div className={style.diagram} role="presentation">
            <WorkspaceIcon workspaceName={props.baseWorkspaceName} />
            <Process phase={props.phase} />
            <WorkspaceIcon workspaceName={props.workspaceName} />
        </div>
    );
};

const WorkspaceIcon: React.FC<{
    workspaceName: string;
}> = (props) => {
    return (
        <div className={style.diagram__workspace}>
            <Icon
                className={style.diagram__workspace__icon}
                icon={props.workspaceName === 'live' ? 'globe' : 'th-large'}
                />
            <span className={style.diagram__workspace__label}>
                {props.workspaceName}
            </span>
        </div>
    );
};

const Process: React.FC<{
    phase: SyncingPhase;
}> = (props) => {
    if (props.phase === SyncingPhase.CONFLICT) {
        return (
            <Icon
                className={cx(
                    style.diagram__process__icon,
                    style['diagram__process__icon--warn'],
                )}
                icon="bolt"
                />
        );
    }

    if (props.phase === SyncingPhase.ERROR) {
        return (
            <Icon
                className={cx(
                    style.diagram__process__icon,
                    style['diagram__process__icon--error'],
                )}
                icon="exclamation-triangle"
                />
        );
    }

    if (props.phase === SyncingPhase.SUCCESS) {
        return (
            <Icon
                className={cx(
                    style.diagram__process__icon,
                    style['diagram__process__icon--success'],
                )}
                icon="check-circle"
                />
        );
    }

    return (
        <Icon
            className={style.diagram__process__icon}
            icon="sync"
            spin={props.phase === SyncingPhase.ONGOING}
            />
    );
};
