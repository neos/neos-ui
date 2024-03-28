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

import {neos} from '@neos-project/neos-ui-decorators';
import {selectors, actions} from '@neos-project/neos-ui-redux-store';
import {GlobalState} from '@neos-project/neos-ui-redux-store/src/System';
import {I18nRegistry, WorkspaceName, WorkspaceStatus} from '@neos-project/neos-ts-interfaces';
import I18n from '@neos-project/neos-ui-i18n';
import {Button, Dialog, Icon} from '@neos-project/react-ui-components';

import {WorkspaceSyncIcon} from '../../PrimaryToolbar/WorkspaceSync';

import style from './style.module.css';

const LABELS_BY_WORKSPACE_STATUS = {
    [WorkspaceStatus.UP_TO_DATE]: {
        dialogMessage: {
            id: 'Neos.Neos.Ui:Main:syncPersonalWorkSpaceMessage',
            fallback:
                'It seems like there are changes in the workspace that are not reflected in your personal workspace.\n' +
                'The changes lead to an error state. Please contact your administrator to resolve the problem.'
        }
    },
    [WorkspaceStatus.OUTDATED]: {
        dialogMessage: {
            id: 'Neos.Neos.Ui:Main:syncPersonalWorkSpaceMessageOutdated',
            fallback:
                'It seems like there are changes in the workspace that are not reflected in your personal workspace.\n' +
                'You should synchronize your personal workspace to avoid conflicts.'
        }
    },
    [WorkspaceStatus.OUTDATED_CONFLICT]: {
        dialogMessage: {
            id: 'Neos.Neos.Ui:Main:syncPersonalWorkSpaceMessageOutdatedConflict',
            fallback:
                'It seems like there are changes in the workspace that are not reflected in your personal workspace.\n' +
                'The changes lead to an error state. Please contact your administrator to resolve the problem.'
        }
    }
}

type SyncWorkspaceDialogPropsFromReduxState = {
    isOpen: boolean;
    personalWorkspaceStatus: WorkspaceStatus;
    personalWorkspaceName: WorkspaceName;
};

const withReduxState = connect((state: GlobalState): SyncWorkspaceDialogPropsFromReduxState => ({
    isOpen: Boolean(state?.cr?.syncing),
    personalWorkspaceStatus: (selectors as any).CR.Workspaces
        .personalWorkspaceRebaseStatusSelector(state),
    personalWorkspaceName: (selectors as any).CR.Workspaces
        .personalWorkspaceNameSelector(state)
}), {
    confirmRebase: actions.CR.Syncing.confirm,
    abortRebase: actions.CR.Syncing.cancel
});

type SyncWorkspaceDialogPropsFromNeosGlobals = {
    i18nRegistry: I18nRegistry;
};

const withNeosGlobals = neos((globalRegistry): SyncWorkspaceDialogPropsFromNeosGlobals => ({
    i18nRegistry: globalRegistry.get('i18n')
}));

type SyncWorkspaceDialogHandlers = {
    confirmRebase: () => void;
    abortRebase: () => void;
};

type SyncWorkspaceDialogProps =
    & SyncWorkspaceDialogPropsFromReduxState
    & SyncWorkspaceDialogPropsFromNeosGlobals
    & SyncWorkspaceDialogHandlers;

const SyncWorkspaceDialog: React.FC<SyncWorkspaceDialogProps> = (props) => {
    const handleAbort = React.useCallback(() => {
        props.abortRebase();
    }, []);
    const handleConfirm = React.useCallback(() => {
        props.confirmRebase();
    }, []);

    if (!props.isOpen) {
        return null;
    }

    return (
        <Dialog
            actions={[
                <Button
                    id="neos-SyncWorkspace-Cancel"
                    key="cancel"
                    style="lighter"
                    hoverStyle="brand"
                    onClick={handleAbort}
                    >
                    <I18n id="cancel" fallback="Cancel"/>
                </Button>,
                props.personalWorkspaceStatus === WorkspaceStatus.OUTDATED ? (
                    <Button
                        id="neos-SyncWorkspace-Confirm"
                        key="confirm"
                        style="warn"
                        hoverStyle="warn"
                        onClick={handleConfirm}
                        >
                        <Icon icon="sync" className={style.buttonIcon}/>
                        <span className={style.confirmText}>
                            <I18n
                                id="Neos.Neos.Ui:Main:syncPersonalWorkSpaceConfirm"
                                fallback="Synchronize now"
                                />
                        </span>
                    </Button>
                ) : null
            ]}
            title={
                <div className={style.modalTitle}>
                    <WorkspaceSyncIcon
                        hasProblem={props.personalWorkspaceStatus === WorkspaceStatus.OUTDATED_CONFLICT}
                        onDarkBackground
                        />
                    <span>
                        <I18n
                            id="Neos.Neos.Ui:Main:syncPersonalWorkSpace"
                            fallback="Synchronize personal workspace"
                            />
                    </span>
                </div>
            }
            onRequestClose={handleAbort}
            type={props.personalWorkspaceStatus === WorkspaceStatus.OUTDATED ? 'warn' : 'error'}
            isOpen
            autoFocus
            theme={undefined as any}
            style={undefined as any}
        >
            <div className={style.modalContents}>
                <p>
                    <I18n {...LABELS_BY_WORKSPACE_STATUS[props.personalWorkspaceStatus].dialogMessage} />
                </p>
            </div>
        </Dialog>
    );
};

export default withReduxState(withNeosGlobals(SyncWorkspaceDialog as any));
