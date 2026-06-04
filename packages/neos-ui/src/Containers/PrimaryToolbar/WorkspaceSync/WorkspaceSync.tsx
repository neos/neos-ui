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
import {GlobalState} from '@neos-project/neos-ui-redux-store';
import {WorkspaceName, WorkspaceStatus, Workspace} from '@neos-project/neos-ts-interfaces';
import {translate} from '@neos-project/neos-ui-i18n';
import {Button} from '@neos-project/react-ui-components';

import {WorkspaceSyncIcon} from './WorkspaceSyncIcon';
import style from './style.module.css';

type WorkspaceSyncPropsFromReduxState = {
    personalWorkspaceStatus: WorkspaceStatus;
    baseWorkspace: WorkspaceName;
    allowedTargetWorkspaces: Record<string, Workspace>;
};

type WorkspaceSyncHandlers = {
    startSyncing: () => void;
};

const withReduxState = connect((state: GlobalState): WorkspaceSyncPropsFromReduxState => ({
    personalWorkspaceStatus: selectors.CR.Workspaces.personalWorkspaceRebaseStatusSelector(state),
    baseWorkspace: selectors.CR.Workspaces.baseWorkspaceSelector(state),
    allowedTargetWorkspaces: selectors.CR.Workspaces.allowedTargetWorkspacesSelector(state),
}), {
    startSyncing: actions.CR.Syncing.start
});

type WorkspaceSyncProps =
    & WorkspaceSyncPropsFromReduxState
    & WorkspaceSyncHandlers;

const WorkspaceSync: React.FC<WorkspaceSyncProps> = (props) => {
    const handleSync = React.useCallback(() => {
        props.startSyncing();
    }, []);

    if (props.personalWorkspaceStatus !== WorkspaceStatus.UP_TO_DATE) {
        const buttonTitle = translate('Neos.Neos.Ui:Main:syncPersonalWorkSpace', 'Synchronize personal workspace');
        return (
            <div id="neos-WorkspaceSync" className={style.wrapper}>
                <Button
                    id="neos-workspace-rebase"
                    className={style.rebaseButton}
                    onClick={handleSync}
                    style={props.personalWorkspaceStatus === WorkspaceStatus.OUTDATED ? 'warn' : 'error'}
                    hoverStyle={props.personalWorkspaceStatus === WorkspaceStatus.OUTDATED ? 'warn' : 'error'}
                    title={buttonTitle}
                >
                    <WorkspaceSyncIcon/>
                </Button>
            </div>
        );
    }

    const baseWorkspaceStatus = props.allowedTargetWorkspaces[props.baseWorkspace]?.status;
    if (baseWorkspaceStatus !== WorkspaceStatus.UP_TO_DATE) {
        const buttonTitle = translate('Neos.Neos.Ui:Main:syncBaseWorkSpace', 'Synchronize base workspace');
        return (
            <div id="neos-WorkspaceSync" className={style.wrapper}>
                <Button
                    id="neos-workspace-rebase"
                    className={style.rebaseButton}
                    onClick={handleSync}
                    style={baseWorkspaceStatus === WorkspaceStatus.OUTDATED ? 'warn' : 'error'}
                    hoverStyle={baseWorkspaceStatus === WorkspaceStatus.OUTDATED ? 'warn' : 'error'}
                    title={buttonTitle}
                >
                    <WorkspaceSyncIcon/>
                </Button>
            </div>
        );
    }

    return null;
};

export default withReduxState(WorkspaceSync as any);
