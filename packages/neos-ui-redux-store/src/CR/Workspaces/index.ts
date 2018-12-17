import produce from 'immer';

import {action as createAction, ActionType} from 'typesafe-actions';
import {NodeContextPath} from '@neos-project/neos-ts-interfaces';

import {actionTypes as system, InitAction} from '@neos-project/neos-ui-redux-store/src/System';
import {WorkspaceName} from '@neos-project/neos-ts-interfaces';

import * as selectors from './selectors';

export interface WorkspaceInformation {
    name: WorkspaceName;
    publishableNodes: Array<{
        contextPath: NodeContextPath;
        documentContextPath: NodeContextPath;
    }>;
    baseWorkspace: WorkspaceName;
    readOnly?: boolean;
}

export interface State extends Readonly<{
    personalWorkspace: WorkspaceInformation;
    toBeDiscarded: NodeContextPath[];
}> {}

export const defaultState: State = {
    personalWorkspace: {
        name: '',
        publishableNodes: [],
        baseWorkspace: ''
    },
    toBeDiscarded: []
};

export enum actionTypes {
    UPDATE = '@neos/neos-ui/CR/Workspaces/UPDATE',
    PUBLISH = '@neos/neos-ui/CR/Workspaces/PUBLISH',
    COMMENCE_DISCARD = '@neos/neos-ui/CR/Workspaces/COMMENCE_DISCARD',
    DISCARD_ABORTED = '@neos/neos-ui/CR/Workspaces/DISCARD_ABORTED',
    DISCARD_CONFIRMED = '@neos/neos-ui/CR/Workspaces/DISCARD_CONFIRMED',
    CHANGE_BASE_WORKSPACE = '@neos/neos-ui/CR/Workspaces/CHANGE_BASE_WORKSPACE'
}

export type Action = ActionType<typeof actions>;

/**
 * Updates the data of a workspace
 */
const update = (data: WorkspaceInformation) => createAction(actionTypes.UPDATE, data);

/**
 * Publish nodes to the given workspace
 */
const publish = (nodeContextPaths: NodeContextPath[], targetWorkspaceName: string) => createAction(actionTypes.PUBLISH, {nodeContextPaths, targetWorkspaceName});

/**
 * Start node discard workflow
 *
 * @param {String} contextPath The contexts paths of the nodes to be discarded
 */
const commenceDiscard = (nodeContextPaths: NodeContextPath[]) => createAction(actionTypes.COMMENCE_DISCARD, nodeContextPaths);

/**
 * Abort the ongoing node discard workflow
 */
const abortDiscard = () => createAction(actionTypes.DISCARD_ABORTED);

/**
 * Confirm the ongoing discard
 */
const confirmDiscard = () =>  createAction(actionTypes.DISCARD_CONFIRMED);

/**
 * Change base workspace
 */
const changeBaseWorkspace = (name: string) => createAction(actionTypes.CHANGE_BASE_WORKSPACE, name);

//
// Export the actions
//
export const actions = {
    update,
    publish,
    commenceDiscard,
    abortDiscard,
    confirmDiscard,
    changeBaseWorkspace
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
            draft.personalWorkspace = action.payload;
            break;
        }
        case actionTypes.COMMENCE_DISCARD: {
            draft.toBeDiscarded = action.payload;
            break;
        }
        case actionTypes.DISCARD_ABORTED: {
            draft.toBeDiscarded = [];
            break;
        }
        case actionTypes.DISCARD_CONFIRMED: {
            draft.toBeDiscarded = [];
            break;
        }
    }
});

//
// Export the selectors
//
export {selectors};
