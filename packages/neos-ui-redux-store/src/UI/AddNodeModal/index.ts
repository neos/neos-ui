import produce from 'immer';
import {action as createAction, ActionType} from 'typesafe-actions';
import {$get} from 'plow-js';

import {actionTypes as system, InitAction} from '@neos-project/neos-ui-redux-store/src/System';
import {NodeContextPath, FusionPath} from '@neos-project/neos-ts-interfaces';

export interface State extends Readonly<{
    contextPath: NodeContextPath | null;
    fusionPath: FusionPath | null;
    toggledGroups: string[];
}> {}

export const defaultState: State = {
    contextPath: null,
    fusionPath: null,
    toggledGroups: []
};

//
// Export the action types
//
export enum actionTypes {
    OPEN = '@neos/neos-ui/UI/AddNodeModal/OPEN',
    CLOSE = '@neos/neos-ui/UI/AddNodeModal/CLOSE',
    TOGGLE_GROUP = '@neos/neos-ui/UI/AddNodeModal/TOGGLE_GROUP'
}

/**
 * Opens the add node modal.
 *
 * @param {String} contextPath ContextPath of the node relative to which the new node ought to be created
 * @param {Object} fusionPath (optional) fusion path of the rendered node relative to which the new node ought to be
 *                            positioned.
 */
const open = (contextPath: NodeContextPath, fusionPath: FusionPath = '') =>  createAction(actionTypes.OPEN, {contextPath, fusionPath});

/**
 * Closes the add node modal.
 */
const close = () => createAction(actionTypes.CLOSE);

/**
 * Toggles the nodetype group.
 */
const toggleGroup = (groupId: string) => createAction(actionTypes.TOGGLE_GROUP, groupId);

//
// Export the actions
//
export const actions = {
    open,
    close,
    toggleGroup
};

export type Action = ActionType<typeof actions>;

//
// Export error messages for testing
//
export enum errorMessages {
    ERROR_INVALID_CONTEXTPATH = 'Context path of reference node must be of type string.',
    ERROR_INVALID_FUSIONPATH = 'Fusion path of reference node must be of type string.'
}

//
// Export the reducer
//
export const reducer = (state: State = defaultState, action: InitAction | Action) => produce(state, draft => {
    switch (action.type) {
        case system.INIT: {
            draft.toggledGroups = $get(['payload', 'ui', 'addNodeModal', 'toggledGroups'], action) || [];
            break;
        }
        case actionTypes.OPEN: {
            if (typeof action.payload.contextPath !== 'string') {
                throw new Error(errorMessages.ERROR_INVALID_CONTEXTPATH);
            }
            if (typeof action.payload.fusionPath !== 'string') {
                throw new Error(errorMessages.ERROR_INVALID_FUSIONPATH);
            }
            draft.contextPath = action.payload.contextPath;
            draft.fusionPath = action.payload.fusionPath;
            break;
        }
        case actionTypes.CLOSE: {
            draft.contextPath = null;
            draft.fusionPath = null;
            break;
        }
        case actionTypes.TOGGLE_GROUP: {
            const groupId = action.payload;
            if (draft.toggledGroups.includes(groupId)) {
                draft.toggledGroups = draft.toggledGroups.filter(i => i !== groupId);
            } else {
                draft.toggledGroups.push(groupId);
            }
            break;
        }
    }
});

export const selectors = {};
