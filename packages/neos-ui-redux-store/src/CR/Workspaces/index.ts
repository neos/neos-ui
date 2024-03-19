import produce from 'immer';
import assignIn from 'lodash.assignin';
import {action as createAction, ActionType} from 'typesafe-actions';
import {NodeContextPath} from '@neos-project/neos-ts-interfaces';

import {actionTypes as system, InitAction} from '../../System';
import {WorkspaceName} from '@neos-project/neos-ts-interfaces';

import * as selectors from './selectors';

type TypeOfChange = number;

interface PublishableNode {
    contextPath: NodeContextPath;
    documentContextPath: NodeContextPath;
    typeOfChange: TypeOfChange;
}

export interface WorkspaceInformation {
    name: WorkspaceName;
    publishableNodes: Array<PublishableNode>;
    baseWorkspace: WorkspaceName;
    readOnly?: boolean;
    status?: string;
}

export enum PublishDiscardMode {
    PUBLISHING,
    DISCARDING
}

export enum PublishDiscardScope {
    SITE,
    DOCUMENT
}

export interface State extends Readonly<{
    personalWorkspace: WorkspaceInformation;
    publishing:
        | null
        | {
            type: 'start';
            mode: PublishDiscardMode;
            scope: PublishDiscardScope;
        }
        | {
            type: 'ongoing';
            mode: PublishDiscardMode;
            scope: PublishDiscardScope;
        }
        | {
            type: 'success';
            mode: PublishDiscardMode;
            scope: PublishDiscardScope;
        }
        | {
            type: 'error';
            mode: PublishDiscardMode;
            scope: PublishDiscardScope;
            message: string;
        }
}> {}

export const defaultState: State = {
    personalWorkspace: {
        name: '',
        publishableNodes: [],
        baseWorkspace: '',
        status: ''
    },
    publishing: null
};

export enum actionTypes {
    UPDATE = '@neos/neos-ui/CR/Workspaces/UPDATE',
    PUBLISH_STARTED = '@neos/neos-ui/CR/Workspaces/PUBLISH_STARTED',
    PUBLISH_ABORTED = '@neos/neos-ui/CR/Workspaces/PUBLISH_ABORTED',
    PUBLISH_CONFIRMED = '@neos/neos-ui/CR/Workspaces/PUBLISH_CONFIRMED',
    PUBLISH_FAILED = '@neos/neos-ui/CR/Workspaces/PUBLISH_FAILED',
    PUBLISH_SUCEEDED = '@neos/neos-ui/CR/Workspaces/PUBLISH_SUCEEDED',
    PUBLISH_FINISHED = '@neos/neos-ui/CR/Workspaces/PUBLISH_FINISHED',
    PUBLISH_ACKNOWLEDGED = '@neos/neos-ui/CR/Workspaces/PUBLISH_ACKNOWLEDGED',
    DISCARD_STARTED = '@neos/neos-ui/CR/Workspaces/DISCARD_STARTED',
    DISCARD_ABORTED = '@neos/neos-ui/CR/Workspaces/DISCARD_ABORTED',
    DISCARD_CONFIRMED = '@neos/neos-ui/CR/Workspaces/DISCARD_CONFIRMED',
    DISCARD_FAILED = '@neos/neos-ui/CR/Workspaces/DISCARD_FAILED',
    DISCARD_SUCCEEDED = '@neos/neos-ui/CR/Workspaces/DISCARD_SUCCEEDED',
    DISCARD_FINISHED = '@neos/neos-ui/CR/Workspaces/DISCARD_FINISHED',
    DISCARD_ACKNOWLEDGED = '@neos/neos-ui/CR/Workspaces/DISCARD_ACKNOWLEDGED',
    CHANGE_BASE_WORKSPACE = '@neos/neos-ui/CR/Workspaces/CHANGE_BASE_WORKSPACE',
    REBASE_WORKSPACE = '@neos/neos-ui/CR/Workspaces/REBASE_WORKSPACE'
}

export type Action = ActionType<typeof actions>;

/**
 * Updates the data of a workspace
 */
const update = (data: WorkspaceInformation) => createAction(actionTypes.UPDATE, data);

/**
 * Publishes all changes in the given scope
 */
const publish = (scope: PublishDiscardScope) => createAction(actionTypes.PUBLISH_STARTED, {scope});

/**
 * Abort the ongoing node publish workflow
 */
const abortPublish = () => createAction(actionTypes.PUBLISH_ABORTED);

/**
 * Confirm the ongoing publish
 */
const confirmPublish = () => createAction(actionTypes.PUBLISH_CONFIRMED);

/**
 * Signal that the ongoing publish failed
 */
const failPublish = (message: string) => createAction(actionTypes.PUBLISH_FAILED, {message});

/**
 * Signal that the ongoing publish succeeded
 */
const succeedPublish = () => createAction(actionTypes.PUBLISH_SUCEEDED);

/**
 * Acknowledge that the publish operation is finished
 */
const acknowledgePublish = () => createAction(actionTypes.PUBLISH_ACKNOWLEDGED);

/**
 * Finish the ongoing publish
 */
const finishPublish = (publishedNodes: PublishableNode[]) => createAction(actionTypes.PUBLISH_FINISHED, {publishedNodes});

/**
 * Discards all changes in the given scope
 */
const discard = (scope: PublishDiscardScope) => createAction(actionTypes.DISCARD_STARTED, {scope});

/**
 * Abort the ongoing node discard workflow
 */
const abortDiscard = () => createAction(actionTypes.DISCARD_ABORTED);

/**
 * Confirm the ongoing discard
 */
const confirmDiscard = () => createAction(actionTypes.DISCARD_CONFIRMED);

/**
 * Signal that the ongoing discard failed
 */
const failDiscard = (message: string) => createAction(actionTypes.DISCARD_FAILED, {message});

/**
 * Signal that the ongoing discard succeeded
 */
const succeedDiscard = () => createAction(actionTypes.DISCARD_SUCCEEDED);

/**
 * Acknowledge that the discard operation is finished
 */
const acknowledgeDiscard = () => createAction(actionTypes.DISCARD_ACKNOWLEDGED);

/**
 * Finish the ongoing discard
 */
const finishDiscard = (discardedNodes: PublishableNode[]) => createAction(actionTypes.DISCARD_FINISHED, {discardedNodes});

/**
 * Change base workspace
 */
const changeBaseWorkspace = (name: string) => createAction(actionTypes.CHANGE_BASE_WORKSPACE, name);

/**
 * Rebase the user workspace
 */
const rebaseWorkspace = (name: string) => createAction(actionTypes.REBASE_WORKSPACE, name);

//
// Export the actions
//
export const actions = {
    update,
    publish,
    abortPublish,
    confirmPublish,
    failPublish,
    succeedPublish,
    acknowledgePublish,
    finishPublish,
    discard,
    abortDiscard,
    confirmDiscard,
    failDiscard,
    succeedDiscard,
    acknowledgeDiscard,
    finishDiscard,
    changeBaseWorkspace,
    rebaseWorkspace
};

//
// Export the reducer
//
export const reducer = (state: State = defaultState, action: InitAction | Action) => produce(state, draft => {
    switch (action.type) {
        case system.INIT: {
            draft.personalWorkspace = action.payload.cr.workspaces.personalWorkspace;
            break;
        }
        case actionTypes.UPDATE: {
            draft.personalWorkspace = assignIn(draft.personalWorkspace, action.payload);
            break;
        }
        case actionTypes.PUBLISH_STARTED: {
            draft.publishing = {
                type: 'start',
                mode: PublishDiscardMode.PUBLISHING,
                scope: action.payload.scope
            };
            break;
        }
        case actionTypes.PUBLISH_ABORTED: {
            draft.publishing = null;
            break;
        }
        case actionTypes.PUBLISH_CONFIRMED: {
            if (draft.publishing?.type === 'start') {
                draft.publishing = {
                    type: 'ongoing',
                    mode: draft.publishing.mode,
                    scope: draft.publishing.scope
                };
            }
            break;
        }
        case actionTypes.PUBLISH_FAILED: {
            if (draft.publishing?.type === 'ongoing') {
                draft.publishing = {
                    type: 'error',
                    mode: draft.publishing.mode,
                    scope: draft.publishing.scope,
                    message: action.payload.message
                };
            }
            break;
        }
        case actionTypes.PUBLISH_SUCEEDED: {
            if (draft.publishing?.type === 'ongoing') {
                draft.publishing = {
                    type: 'success',
                    mode: draft.publishing.mode,
                    scope: draft.publishing.scope
                };
            }
            break;
        }
        case actionTypes.PUBLISH_FINISHED: {
            draft.publishing = null;
            draft.personalWorkspace.publishableNodes =
                state.personalWorkspace.publishableNodes.filter(
                    (publishableNode) => !action.payload.publishedNodes.some(
                        (publishedNode) => publishedNode.contextPath === publishableNode.contextPath
                    )
                );
            break;
        }
        case actionTypes.DISCARD_STARTED: {
            draft.publishing = {
                type: 'start',
                mode: PublishDiscardMode.DISCARDING,
                scope: action.payload.scope
            };
            break;
        }
        case actionTypes.DISCARD_ABORTED: {
            draft.publishing = null;
            break;
        }
        case actionTypes.DISCARD_CONFIRMED: {
            if (draft.publishing?.type === 'start') {
                draft.publishing = {
                    type: 'ongoing',
                    mode: draft.publishing.mode,
                    scope: draft.publishing.scope
                };
            }
            break;
        }
        case actionTypes.DISCARD_FAILED: {
            if (draft.publishing?.type === 'ongoing') {
                draft.publishing = {
                    type: 'error',
                    mode: draft.publishing.mode,
                    scope: draft.publishing.scope,
                    message: action.payload.message
                };
            }
            break;
        }
        case actionTypes.DISCARD_SUCCEEDED: {
            if (draft.publishing?.type === 'ongoing') {
                draft.publishing = {
                    type: 'success',
                    mode: draft.publishing.mode,
                    scope: draft.publishing.scope
                };
            }
            break;
        }
        case actionTypes.DISCARD_FINISHED: {
            draft.publishing = null;
            draft.personalWorkspace.publishableNodes =
                state.personalWorkspace.publishableNodes.filter(
                    (publishableNode) => !action.payload.discardedNodes.some(
                        (discardedNode) => discardedNode.contextPath === publishableNode.contextPath
                    )
                );
            break;
        }
    }
});

//
// Export the selectors
//
export {selectors};
