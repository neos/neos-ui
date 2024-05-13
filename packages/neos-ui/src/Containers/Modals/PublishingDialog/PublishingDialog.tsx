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
import {
    PublishingScope,
    PublishingPhase,
    State as PublishingState,
    PublishingMode
} from '@neos-project/neos-ui-redux-store/src/CR/Publishing';

import {ConfirmationDialog} from './ConfirmationDialog';
import {ProcessIndicator} from './ProcessIndicator';
import {ResultDialog} from './ResultDialog';

const {
    publishableNodesSelector,
    publishableNodesInDocumentSelector,
    personalWorkspaceNameSelector
} = (selectors as any).CR.Workspaces;
const {siteNodeSelector, documentNodeSelector} = (selectors as any).CR.Nodes;

type PublishingDialogProperties =
    | { publishingState: null }
    | {
        publishingState: NonNullable<PublishingState>;
        scopeTitle: string;
        sourceWorkspaceName: string;
        targetWorkspaceName: null | string;
        numberOfChanges: number;
    };

type PublishingDialogHandlers = {
    cancel: () => void;
    confirm: () => void;
    retry: () => void;
    acknowledge: () => void;
}

type PublishingDialogProps =
    PublishingDialogProperties & PublishingDialogHandlers;

const PublishingDialog: React.FC<PublishingDialogProps> = (props) => {
    const handleCancel = React.useCallback(() => {
        props.cancel();
    }, []);
    const handleConfirm = React.useCallback(() => {
        props.confirm();
    }, []);
    const handleRetry = React.useCallback(() => {
        props.retry();
    }, []);
    const handleAcknowledge = React.useCallback(() => {
        props.acknowledge();
    }, []);

    if (props.publishingState === null) {
        return null;
    }

    switch (props.publishingState.process.phase) {
        case PublishingPhase.START:
            return (
                <ConfirmationDialog
                    mode={props.publishingState.mode}
                    scope={props.publishingState.scope}
                    scopeTitle={props.scopeTitle}
                    sourceWorkspaceName={props.sourceWorkspaceName}
                    targetWorkspaceName={props.targetWorkspaceName}
                    numberOfChanges={props.numberOfChanges}
                    onAbort={handleCancel}
                    onConfirm={handleConfirm}
                    />
            );

        case PublishingPhase.ONGOING:
            return (
                <ProcessIndicator
                    mode={props.publishingState.mode}
                    scope={props.publishingState.scope}
                    scopeTitle={props.scopeTitle}
                    sourceWorkspaceName={props.sourceWorkspaceName}
                    targetWorkspaceName={props.targetWorkspaceName}
                    numberOfChanges={props.numberOfChanges}
                    />
            );

        case PublishingPhase.ERROR:
        case PublishingPhase.SUCCESS:
            return (
                <ResultDialog
                    mode={props.publishingState.mode}
                    scope={props.publishingState.scope}
                    scopeTitle={props.scopeTitle}
                    sourceWorkspaceName={props.sourceWorkspaceName}
                    targetWorkspaceName={props.targetWorkspaceName}
                    numberOfChanges={props.numberOfChanges}
                    result={props.publishingState.process}
                    onRetry={handleRetry}
                    onAcknowledge={handleAcknowledge}
                    />
            );
    }
};

export default connect((state: GlobalState): PublishingDialogProperties => {
    const {publishing: publishingState} = state.cr;
    if (publishingState === null) {
        return {publishingState};
    }

    const {scope} = publishingState;
    const {name: sourceWorkspaceName, baseWorkspace} = state.cr.workspaces.personalWorkspace;
    const targetWorkspaceName = publishingState.mode === PublishingMode.PUBLISH
        ? baseWorkspace
        : null;

    let numberOfChanges = 0;
    if (publishingState.process.phase === PublishingPhase.SUCCESS) {
        numberOfChanges = publishingState.process.numberOfAffectedChanges;
    } else if (scope === PublishingScope.ALL) {
        numberOfChanges = state.cr.workspaces.personalWorkspace.totalNumberOfChanges;
    } else if (scope === PublishingScope.SITE) {
        numberOfChanges = publishableNodesSelector(state).length;
    } else if (scope === PublishingScope.DOCUMENT) {
        numberOfChanges = publishableNodesInDocumentSelector(state).length;
    }

    let scopeTitle = 'N/A';
    if (scope === PublishingScope.ALL) {
        scopeTitle = personalWorkspaceNameSelector(state);
    } else if (scope === PublishingScope.SITE) {
        scopeTitle = siteNodeSelector(state).label;
    } else if (scope === PublishingScope.DOCUMENT) {
        scopeTitle = documentNodeSelector(state).label;
    }

    return {
        publishingState,
        sourceWorkspaceName,
        targetWorkspaceName,
        numberOfChanges,
        scopeTitle
    };
}, {
    confirm: (actions as any).CR.Publishing.confirm,
    cancel: (actions as any).CR.Publishing.cancel,
    retry: (actions as any).CR.Publishing.retry,
    acknowledge: (actions as any).CR.Publishing.acknowledge
})(PublishingDialog);
