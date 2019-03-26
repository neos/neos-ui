import produce from 'immer';
import {action as createAction, ActionType} from 'typesafe-actions';

import {InitAction} from '@neos-project/neos-ui-redux-store/src/System';

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
    OPEN = '@neos/neos-ui/UI/KeyboardShortcutModal/OPEN',
    CLOSE = '@neos/neos-ui/UI/KeyboardShortcutModal/CLOSE'
}

/**
 * Opens the KeyboardShortcut Modal
 */
const open = () => createAction(actionTypes.OPEN);

/**
 * Closes the KeyboardShortcut Modal
 */
const close = () => createAction(actionTypes.CLOSE);

//
// Export the actions
//
export const actions = {
    open,
    close
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
        case actionTypes.CLOSE: {
            draft.isOpen = false;
            break;
        }
    }
});

export const selectors = {};
