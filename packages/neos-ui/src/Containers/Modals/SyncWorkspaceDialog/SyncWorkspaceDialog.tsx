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
import {I18nRegistry, WorkspaceName} from '@neos-project/neos-ts-interfaces';
import {ResolutionStrategy, SyncingPhase, State as SyncingState} from '@neos-project/neos-ui-redux-store/src/CR/Syncing';

import {ConfirmationDialog} from './ConfirmationDialog';
import {ProcessIndicator} from './ProcessIndicator';
import {ResolutionStrategySelectionDialog} from './ResolutionStrategySelectionDialog';
import {ResolutionStrategyConfirmationDialog} from './ResolutionStrategyConfirmationDialog';
import {ResultDialog} from './ResultDialog';

type SyncWorkspaceDialogPropsFromReduxState = {
    syncingState: SyncingState;
    personalWorkspaceName: WorkspaceName;
    baseWorkspaceName: WorkspaceName;
    totalNumberOfChangesInWorkspace: number;
};

const withReduxState = connect((state: GlobalState): SyncWorkspaceDialogPropsFromReduxState => ({
    syncingState: {
        process: {
            phase: SyncingPhase.ONGOING
        }
    },
    personalWorkspaceName: selectors.CR.Workspaces
        .personalWorkspaceNameSelector(state),
    baseWorkspaceName: selectors.CR.Workspaces
        .baseWorkspaceSelector(state),
    totalNumberOfChangesInWorkspace: state.cr.workspaces.personalWorkspace
        .totalNumberOfChanges
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
    const handleCancel = React.useCallback(() => {
        console.log('@TODO: props.abortRebase()');
    }, []);
    const handleConfirm = React.useCallback(() => {
        console.log('@TODO: props.confirmRebase()');
    }, [props.personalWorkspaceName]);
    const handleSelectResolutionStrategy = React.useCallback((selectedStrategy: ResolutionStrategy) => {
        console.log('@TODO: Resolution strategy was selected', {selectedStrategy});
    }, []);
    const handleCancelConflictResolution = React.useCallback(() => {
        console.log('@TODO: handleCancelConflictResolution');
    }, []);
    const handleConfirmResolutionStrategy = React.useCallback(() => {
        console.log('@TODO: handleConfirmResolutionStrategy');
    }, []);
    const handleAcknowledge = React.useCallback(() => {
        console.log('@TODO: handleAcknowledge');
    }, []);
    const handleRetry = React.useCallback(() => {
        console.log('@TODO: handleRetry');
    }, []);

    switch (props.syncingState?.process.phase) {
        case SyncingPhase.START:
            return (
                <ConfirmationDialog
                    workspaceName={props.personalWorkspaceName}
                    baseWorkspaceName={props.baseWorkspaceName}
                    onCancel={handleCancel}
                    onConfirm={handleConfirm}
                    />
            );
        case SyncingPhase.ONGOING:
            return (
                <ProcessIndicator
                    workspaceName={props.personalWorkspaceName}
                    baseWorkspaceName={props.baseWorkspaceName}
                    />
            );
        case SyncingPhase.CONFLICT:
            return (
                <ResolutionStrategySelectionDialog
                    workspaceName={props.personalWorkspaceName}
                    baseWorkspaceName={props.baseWorkspaceName}
                    conflicts={props.syncingState.process.conflicts}
                    i18n={props.i18nRegistry}
                    onCancel={handleCancel}
                    onSelectResolutionStrategy={handleSelectResolutionStrategy}
                    />
            );
        case SyncingPhase.RESOLVING:
            return (
                <ResolutionStrategyConfirmationDialog
                    workspaceName={props.personalWorkspaceName}
                    baseWorkspaceName={props.baseWorkspaceName}
                    totalNumberOfChangesInWorkspace={props.totalNumberOfChangesInWorkspace}
                    strategy={props.syncingState.process.strategy}
                    conflicts={props.syncingState.process.conflicts}
                    i18n={props.i18nRegistry}
                    onCancelConflictResolution={handleCancelConflictResolution}
                    onConfirmResolutionStrategy={handleConfirmResolutionStrategy}
                    />
            );
        case SyncingPhase.ERROR:
        case SyncingPhase.SUCCESS:
            return (
                <ResultDialog
                    workspaceName={props.personalWorkspaceName}
                    baseWorkspaceName={props.baseWorkspaceName}
                    result={props.syncingState.process}
                    onAcknowledge={handleAcknowledge}
                    onRetry={handleRetry}
                    />
            );
        default:
            return null;
    }
};

export default withReduxState(withNeosGlobals(SyncWorkspaceDialog as any));
