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
    syncingState: state.cr.syncing,
    personalWorkspaceName: selectors.CR.Workspaces
        .personalWorkspaceNameSelector(state),
    baseWorkspaceName: selectors.CR.Workspaces
        .baseWorkspaceSelector(state),
    totalNumberOfChangesInWorkspace: state.cr.workspaces.personalWorkspace
        .totalNumberOfChanges
}), {
    confirm: actions.CR.Syncing.confirm,
    cancel: actions.CR.Syncing.cancel,
    selectResolutionStrategy: actions.CR.Syncing.selectResolutionStrategy,
    cancelResolution: actions.CR.Syncing.cancelResolution,
    confirmResolution: actions.CR.Syncing.confirmResolution,
    retry: actions.CR.Syncing.retry,
    acknowledge: actions.CR.Syncing.acknowledge
});

type SyncWorkspaceDialogPropsFromNeosGlobals = {
    i18nRegistry: I18nRegistry;
};

const withNeosGlobals = neos((globalRegistry): SyncWorkspaceDialogPropsFromNeosGlobals => ({
    i18nRegistry: globalRegistry.get('i18n')
}));

type SyncWorkspaceDialogHandlers = {
    confirm: () => void;
    cancel: () => void;
    selectResolutionStrategy: (selectedStrategy: ResolutionStrategy) => void;
    cancelResolution: () => void;
    confirmResolution: () => void;
    retry: () => void;
    acknowledge: () => void;
};

type SyncWorkspaceDialogProps =
    & SyncWorkspaceDialogPropsFromReduxState
    & SyncWorkspaceDialogPropsFromNeosGlobals
    & SyncWorkspaceDialogHandlers;

const SyncWorkspaceDialog: React.FC<SyncWorkspaceDialogProps> = (props) => {
    const handleCancel = React.useCallback(() => {
        props.cancel();
    }, []);
    const handleConfirm = React.useCallback(() => {
        props.confirm();
    }, []);
    const handleSelectResolutionStrategy = React.useCallback((selectedStrategy: ResolutionStrategy) => {
        props.selectResolutionStrategy(selectedStrategy);
    }, []);
    const handleCancelConflictResolution = React.useCallback(() => {
        props.cancelResolution();
    }, []);
    const handleConfirmResolutionStrategy = React.useCallback(() => {
        props.confirmResolution();
    }, []);
    const handleAcknowledge = React.useCallback(() => {
        props.acknowledge();
    }, []);
    const handleRetry = React.useCallback(() => {
        props.retry();
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
