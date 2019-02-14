import {action as createAction, ActionType} from 'typesafe-actions';
import {$get} from 'plow-js';

import {actionTypes as system, InitAction, GlobalState} from '@neos-project/neos-ui-redux-store/src/System';

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
export const reducer = (state: State = defaultState, action: InitAction | Action) => {
    switch (action.type) {
        case system.INIT: {
            return $get(['payload', 'ui', 'editPreviewMode'], action) || defaultState;
        }
        case actionTypes.SET: {
            return action.payload.editPreviewMode;
        }
        default: {
            return state;
        }
    }
};

//
// Export the selectors
//
export const selectors = {
    currentEditPreviewMode: (state: GlobalState) => $get(['ui', 'editPreviewMode'], state)
};
