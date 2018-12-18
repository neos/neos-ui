import {action as createAction, ActionType} from 'typesafe-actions';
import {$get, $set} from 'plow-js';

import {InitAction, GlobalState} from '@neos-project/neos-ui-redux-store/src/System';

export type State = string;

export const defaultState: State = 'inPlace';

//
// Export the action types
//
export enum actionTypes {
    SET = '@neos/neos-ui/UI/EditPreviewMode/SET'
}

export type Action = ActionType<typeof actions>;

//
// Export the actions
//
export const actions = {
    /**
     * Sets the currently active edit/preview mode
     */
    set: (editPreviewMode: string) => createAction(actionTypes.SET, {editPreviewMode})
};

//
// Export the reducer
//
export const subReducer = (state: State = defaultState, action: InitAction | Action) => {
    switch (action.type) {
        case actionTypes.SET: {
            return action.payload.editPreviewMode;
        }
        default: {
            return state;
        }
    }
};

export const reducer = (globalState: GlobalState, action: InitAction | Action) => {
    // TODO: substitute global state with State when conversion of all UI reducers is done
    const state = $get(['ui', 'editPreviewMode'], globalState) || undefined;
    const newState = subReducer(state, action);
    return $set(['ui', 'editPreviewMode'], newState, globalState);
};

//
// Export the selectors
//
export const selectors = {
    currentEditPreviewMode: (state: GlobalState) => $get(['ui', 'editPreviewMode'], state)
};
