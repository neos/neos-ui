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
import {PublishDiscardScope, PublishDiscardMode} from '@neos-project/neos-ui-redux-store/src/CR/Workspaces';

import {ConfirmationDialog} from './ConfirmationDialog';
import {ProcessIndicator} from './ProcessIndicator';
import {ResultDialog} from './ResultDialog';

const {publishableNodesSelector, publishableNodesInDocumentSelector} = (selectors as any).CR.Workspaces;
const {siteNodeSelector, documentNodeSelector} = (selectors as any).CR.Nodes;

type PublishDiscardDialogState =
    | { type: 'idle' }
    | {
        type: 'start';
        mode: PublishDiscardMode;
        scope: PublishDiscardScope;
        scopeTitle: string;
        workspaceName: string;
        numberOfChanges: number;
    }
    | {
        type: 'ongoing';
        mode: PublishDiscardMode;
        scope: PublishDiscardScope;
        scopeTitle: string;
        workspaceName: string;
        numberOfChanges: number;
    }
    | {
        type: 'success';
        mode: PublishDiscardMode;
        scope: PublishDiscardScope;
        scopeTitle: string;
        numberOfChanges: number;
    }
    | {
        type: 'error';
        mode: PublishDiscardMode;
        scope: PublishDiscardScope;
        scopeTitle: string;
        numberOfChanges: number;
        message: string;
    }

const PublishDiscardDialog: React.FC<{
    state: PublishDiscardDialogState;
    confirmDiscard: () => void;
    abortDiscard: () => void;
    acknowledgeDiscard: () => void;
    confirmPublish: () => void;
    abortPublish: () => void;
    acknowledgePublish: () => void;
}> = (props) => {
    const handleAbort = React.useCallback(() => {
        if (props.state.type === 'start') {
            if (props.state.mode === PublishDiscardMode.PUBLISHING) {
                props.abortPublish();
            } else if (props.state.mode === PublishDiscardMode.DISCARDING) {
                props.abortDiscard();
            }
        }
    }, [props.state.type]);
    const handleConfirm = React.useCallback(() => {
        if (props.state.type === 'start') {
            if (props.state.mode === PublishDiscardMode.PUBLISHING) {
                props.confirmPublish();
            } else if (props.state.mode === PublishDiscardMode.DISCARDING) {
                props.confirmDiscard();
            }
        }
    }, [props.state.type]);
    const handleAcknowledge = React.useCallback(() => {
        if (props.state.type === 'success' || props.state.type === 'error') {
            if (props.state.mode === PublishDiscardMode.PUBLISHING) {
                props.acknowledgePublish();
            } else if (props.state.mode === PublishDiscardMode.DISCARDING) {
                props.acknowledgeDiscard();
            }
        }
    }, [props.state.type]);
    const handleRetry = React.useCallback(() => {
        console.log('@TODO: handleRetry');
    }, []);

    switch (props.state.type) {
        default:
        case 'idle':
            return null;

        case 'start':
            return (
                <ConfirmationDialog
                    {...props.state}
                    onAbort={handleAbort}
                    onConfirm={handleConfirm}
                    />
            );

        case 'ongoing':
            return (
                <ProcessIndicator {...props.state} />
            );

        case 'error':
        case 'success':
            return (
                <ResultDialog
                    {...props.state}
                    onAcknowledge={handleAcknowledge}
                    onRetry={handleRetry}
                    />
            );
    }
};

export default connect((state: GlobalState): { state: PublishDiscardDialogState } => {
    const {publishing} = state.cr.workspaces;
    if (publishing === null) {
        return {state: {type: 'idle'}};
    }

    const {name: workspaceName} = state.cr.workspaces.personalWorkspace;

    let numberOfChanges = 0;
    if (publishing.scope === PublishDiscardScope.SITE) {
        numberOfChanges = publishableNodesSelector(state).length;
    } else if (publishing.scope === PublishDiscardScope.DOCUMENT) {
        numberOfChanges = publishableNodesInDocumentSelector(state).length;
    }

    let scopeTitle = 'N/A';
    if (publishing.scope === PublishDiscardScope.SITE) {
        scopeTitle = siteNodeSelector(state).label;
    } else if (publishing.scope === PublishDiscardScope.DOCUMENT) {
        scopeTitle = documentNodeSelector(state).label;
    }

    let result: PublishDiscardDialogState = {type: 'idle'};
    if (publishing.type === 'start') {
        result = {
            type: 'start',
            mode: publishing.mode,
            scope: publishing.scope,
            scopeTitle,
            workspaceName,
            numberOfChanges
        };
    } else if (publishing.type === 'ongoing') {
        result = {
            type: 'ongoing',
            mode: publishing.mode,
            scope: publishing.scope,
            scopeTitle,
            workspaceName,
            numberOfChanges
        };
    } else if (publishing.type === 'error') {
        result = {
            type: 'error',
            mode: publishing.mode,
            scope: publishing.scope,
            message: publishing.message,
            scopeTitle,
            numberOfChanges
        };
    } else if (publishing.type === 'success') {
        result = {
            type: 'success',
            mode: publishing.mode,
            scope: publishing.scope,
            scopeTitle,
            numberOfChanges
        };
    }

    return {state: result};
}, {
    confirmDiscard: (actions as any).CR.Workspaces.confirmDiscard,
    abortDiscard: (actions as any).CR.Workspaces.abortDiscard,
    acknowledgeDiscard: (actions as any).CR.Workspaces.acknowledgeDiscard,
    confirmPublish: (actions as any).CR.Workspaces.confirmPublish,
    abortPublish: (actions as any).CR.Workspaces.abortPublish,
    acknowledgePublish: (actions as any).CR.Workspaces.acknowledgePublish
})(PublishDiscardDialog);
