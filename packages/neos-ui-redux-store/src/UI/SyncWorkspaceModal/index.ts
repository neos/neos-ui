import produce from 'immer';
import {action as createAction, ActionType} from 'typesafe-actions';

import {InitAction} from '../../System';

export interface State extends Readonly<{
    isOpen: boolean;
}> {}

export const defaultState: State = {
    isOpen: false
};

//
// Export the action types
//
export enum actionTypes {
    OPEN = '@neos/neos-ui/UI/SyncWorkspaceModal/OPEN',
    CANCEL = '@neos/neos-ui/UI/SyncWorkspaceModal/CANCEL',
    APPLY = '@neos/neos-ui/UI/SyncWorkspaceModal/APPLY'
}

/**
 * Opens the add node modal.
 */
const open = () => createAction(actionTypes.OPEN);

/**
 * Closes the add node modal.
 */
const cancel = () => createAction(actionTypes.CANCEL);

/**
 * Closes the add node modal.
 */
const apply = () => createAction(actionTypes.APPLY);

//
// Export the actions
//
export const actions = {
    open,
    cancel,
    apply
};

export type Action = ActionType<typeof actions>;

//
// Export the reducer
//
export const reducer = (state: State = defaultState, action: InitAction | Action) => produce(state, draft => {
    switch (action.type) {
        case actionTypes.OPEN: {
            draft.isOpen = true;
            break;
        }
        case actionTypes.CANCEL: {
            draft.isOpen = false;
            break;
        }
        case actionTypes.APPLY: {
            draft.isOpen = false;
            break;
        }
    }
});

export const selectors = {};
