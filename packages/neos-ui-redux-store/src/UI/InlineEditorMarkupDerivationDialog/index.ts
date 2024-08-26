import produce from 'immer';
import {action as createAction, ActionType} from 'typesafe-actions';

import {InitAction} from '../../System';

export interface State extends Readonly<{
    isOpen: boolean;
    acknowledgement?: 'CANCELED' | 'CONFIRMED'
}> {}

export const defaultState: State = {
    isOpen: false
};

//
// Export the action types
//
export enum actionTypes {
    OPEN = '@neos/neos-ui/UI/InlineEditorMarkupDerivationDialog/OPEN',
    CANCEL = '@neos/neos-ui/UI/InlineEditorMarkupDerivationDialog/CANCEL',
    CONFIRM = '@neos/neos-ui/UI/InlineEditorMarkupDerivationDialog/CONFIRM'
}

/**
 * Opens the modal
 */
const open = () => createAction(actionTypes.OPEN);

/**
 * Closes the modal
 */
const cancel = () => createAction(actionTypes.CANCEL);

/**
 * Confirms the modal
 */
const confirm = () => createAction(actionTypes.CONFIRM);

//
// Export the actions
//
export const actions = {
    open,
    cancel,
    confirm
};

export type Action = ActionType<typeof actions>;

//
// Export the reducer
//
export const reducer = (state: State = defaultState, action: InitAction | Action) => produce(state, draft => {
    switch (action.type) {
        case actionTypes.OPEN: {
            draft.isOpen = true;
            draft.acknowledgement = undefined;
            break;
        }
        case actionTypes.CANCEL: {
            draft.isOpen = false;
            draft.acknowledgement = 'CANCELED';
            break;
        }
        case actionTypes.CONFIRM: {
            draft.isOpen = false;
            draft.acknowledgement = 'CONFIRMED';
            break;
        }
    }
});

export const selectors = {};
