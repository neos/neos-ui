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
// @ts-ignore
import {connect} from 'react-redux';

import {actions, selectors} from '@neos-project/neos-ui-redux-store';
import {GlobalState} from '@neos-project/neos-ui-redux-store/src/System';
import {neos} from '@neos-project/neos-ui-decorators';
import {I18nRegistry, WorkspaceStatus} from '@neos-project/neos-ts-interfaces';
import {Button} from '@neos-project/react-ui-components';

import {WorkspaceSyncIcon} from './WorkspaceSyncIcon';
import style from './style.module.css';

type WorkspaceSyncPropsFromReduxState = {
    personalWorkspaceStatus: WorkspaceStatus;
};

type WorkspaceSyncHandlers = {
    startSyncing: () => void;
};

const withReduxState = connect((state: GlobalState): WorkspaceSyncPropsFromReduxState => ({
    personalWorkspaceStatus: selectors.CR.Workspaces
        .personalWorkspaceRebaseStatusSelector(state)
}), {
    startSyncing: actions.CR.Syncing.start
});

type WorkspaceSyncPropsFromNeosGlobals = {
    i18nRegistry: I18nRegistry;
};

const withNeosGlobals = neos((globalRegistry): WorkspaceSyncPropsFromNeosGlobals => ({
    i18nRegistry: globalRegistry.get('i18n')
}));

type WorkspaceSyncProps =
    & WorkspaceSyncPropsFromReduxState
    & WorkspaceSyncPropsFromNeosGlobals
    & WorkspaceSyncHandlers;

const WorkspaceSync: React.FC<WorkspaceSyncProps> = (props) => {
    const handleClick = React.useCallback(() => {
        props.startSyncing();
    }, []);

    if (props.personalWorkspaceStatus === WorkspaceStatus.UP_TO_DATE) {
        return null;
    }

    const buttonTitle = props.i18nRegistry.translate(
        'syncPersonalWorkSpace',
        'Synchronize personal workspace', {}, 'Neos.Neos.Ui', 'Main');
    return (
        <div id="neos-WorkspaceSync" className={style.wrapper}>
            <Button
                id="neos-workspace-rebase"
                className={style.rebaseButton}
                onClick={handleClick}
                style={props.personalWorkspaceStatus === WorkspaceStatus.OUTDATED ? 'warn' : 'error'}
                hoverStyle={props.personalWorkspaceStatus === WorkspaceStatus.OUTDATED ? 'warn' : 'error'}
                title={buttonTitle}
            >
                <WorkspaceSyncIcon
                    hasProblem={props.personalWorkspaceStatus === WorkspaceStatus.OUTDATED_CONFLICT}
                    />
            </Button>
        </div>
    );
};

export default withReduxState(withNeosGlobals(WorkspaceSync as any));
