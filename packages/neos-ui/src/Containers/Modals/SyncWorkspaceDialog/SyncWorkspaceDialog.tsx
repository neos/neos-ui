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

import {selectors, actions} from '@neos-project/neos-ui-redux-store';
import {GlobalState} from '@neos-project/neos-ui-redux-store/src/System';
import {WorkspaceName, WorkspaceStatus} from '@neos-project/neos-ts-interfaces';

import {ConfirmationDialog} from './ConfirmationDialog';

type SyncWorkspaceDialogPropsFromReduxState = {
    isOpen: boolean;
    personalWorkspaceStatus: WorkspaceStatus;
    personalWorkspaceName: WorkspaceName;
};

const withReduxState = connect((state: GlobalState): SyncWorkspaceDialogPropsFromReduxState => ({
    isOpen: state?.ui?.SyncWorkspaceModal?.isOpen,
    personalWorkspaceStatus: (selectors as any).CR.Workspaces
        .personalWorkspaceRebaseStatusSelector(state),
    personalWorkspaceName: (selectors as any).CR.Workspaces
        .personalWorkspaceNameSelector(state)
}), {
    confirmRebase: (actions as any).UI.SyncWorkspaceModal.apply,
    abortRebase: (actions as any).UI.SyncWorkspaceModal.cancel,
    rebaseWorkspace: (actions as any).CR.Workspaces.rebaseWorkspace
});

type SyncWorkspaceDialogHandlers = {
    confirmRebase: () => void;
    abortRebase: () => void;
    rebaseWorkspace: (workspaceName: WorkspaceName) => void;
};

type SyncWorkspaceDialogProps =
    & SyncWorkspaceDialogPropsFromReduxState
    & SyncWorkspaceDialogHandlers;

const SyncWorkspaceDialog: React.FC<SyncWorkspaceDialogProps> = (props) => {
    const handleCancel = React.useCallback(() => {
        props.abortRebase();
    }, []);
    const handleConfirm = React.useCallback(() => {
        props.rebaseWorkspace(props.personalWorkspaceName);
    }, [props.personalWorkspaceName]);

    if (!props.isOpen) {
        return null;
    }

    return (
        <ConfirmationDialog
            workspaceStatus={props.personalWorkspaceStatus}
            onCancel={handleCancel}
            onConfirm={handleConfirm}
            />
    );
};

export default withReduxState(SyncWorkspaceDialog as any);
