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
import {PublishingPhase} from '@neos-project/neos-ui-redux-store/src/CR/Publishing';

import style from './style.module.css';

export const Diagram: React.FC<{
    phase: PublishingPhase;
    sourceWorkspaceName: string;
    targetWorkspaceName: null | string;
    numberOfChanges: number;
}> = (props) => {
    return (
        <div className={style.diagram} role="presentation">
            <WorkspaceIcon workspaceName={props.sourceWorkspaceName} />
            <Process phase={props.phase} numberOfChanges={props.numberOfChanges} />
            <TargetIcon workspaceName={props.targetWorkspaceName} />
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
    phase: PublishingPhase;
    numberOfChanges: number;
}> = (props) => {
    return (
        <div
            className={cx(
                style.diagram__process,
                (props.phase === PublishingPhase.ERROR || props.phase === PublishingPhase.SUCCESS)
                    && style['diagram__process--result']
            )}
            >
            <Changes phase={props.phase} numberOfChanges={props.numberOfChanges} />
            <Icon className={style.diagram__process__chevron} icon="chevron-right"/>
        </div>
    );
};

const Changes: React.FC<{
    phase: PublishingPhase;
    numberOfChanges: number;
}> = (props) => {
    if (props.phase === PublishingPhase.ONGOING) {
        return (
            <Icon
                className={cx(
                    style.diagram__process__icon,
                    style['diagram__process__icon--ongoing'],
                )}
                icon="file"
                />
        );
    }

    if (props.phase === PublishingPhase.ERROR) {
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

    if (props.phase === PublishingPhase.SUCCESS) {
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
        <div className={style.diagram__process__changes}>
            <Icon className={style.diagram__process__icon} icon="file" />
            <span className={style.diagram__process__changes__number}>
                {props.numberOfChanges}
            </span>
        </div>
    )
}

const TargetIcon: React.FC<{
    workspaceName: null | string
}> = (props) => {
    if (props.workspaceName === null) {
        return (
            <div className={style.diagram__workspace}>
                <Icon
                    className={cx(
                        style.diagram__workspace__icon,
                        style['diagram__workspace__icon--trash']
                    )}
                    icon="trash"
                    />
            </div>
        );
    }

    return (<WorkspaceIcon workspaceName={props.workspaceName} />);
};
