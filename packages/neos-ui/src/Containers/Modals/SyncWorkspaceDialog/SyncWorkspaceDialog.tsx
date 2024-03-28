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
import {WorkspaceName} from '@neos-project/neos-ts-interfaces';

import {ConfirmationDialog} from './ConfirmationDialog';

type SyncWorkspaceDialogPropsFromReduxState = {
    isOpen: boolean;
    personalWorkspaceName: WorkspaceName;
    baseWorkspaceName: WorkspaceName;
};

const withReduxState = connect((state: GlobalState): SyncWorkspaceDialogPropsFromReduxState => ({
    isOpen: true,
    personalWorkspaceName: (selectors as any).CR.Workspaces
        .personalWorkspaceNameSelector(state),
    baseWorkspaceName: (selectors as any).CR.Workspaces
        .baseWorkspaceSelector(state)
}), {
    confirmRebase: actions.CR.Syncing.confirm,
    abortRebase: actions.CR.Syncing.cancel
});

type SyncWorkspaceDialogHandlers = {
    confirmRebase: () => void;
    abortRebase: () => void;
};

type SyncWorkspaceDialogProps =
    & SyncWorkspaceDialogPropsFromReduxState
    & SyncWorkspaceDialogHandlers;

const SyncWorkspaceDialog: React.FC<SyncWorkspaceDialogProps> = (props) => {
    const handleCancel = React.useCallback(() => {
        props.abortRebase();
    }, []);
    const handleConfirm = React.useCallback(() => {
        props.confirmRebase();
    }, []);

    if (!props.isOpen) {
        return null;
    }

    return (
        <ConfirmationDialog
            workspaceName={props.personalWorkspaceName}
            baseWorkspaceName={props.baseWorkspaceName}
            onCancel={handleCancel}
            onConfirm={handleConfirm}
            />
    );
};

export default withReduxState(SyncWorkspaceDialog as any);
