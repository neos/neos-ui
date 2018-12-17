import produce from 'immer';
import {action as createAction, ActionType} from 'typesafe-actions';
import {$get, $set} from 'plow-js';

import {actionTypes as system, InitAction, GlobalState} from '@neos-project/neos-ui-redux-store/src/System';

export interface State extends Readonly<{
    isHidden: boolean;
}> {}

export const defaultState: State = {
    isHidden: true
};

//
// Export the action types
//
export enum actionTypes {
    TOGGLE = '@neos/neos-ui/UI/EditModePanel/TOGGLE'
}

/**
 * Toggles the edit mode panel
 */

//
// Export the actions
//
export const actions = {
    toggle: () => createAction(actionTypes.TOGGLE)
};

export type Action = ActionType<typeof actions>;

//
// Export the reducer
//
export const subReducer = (state: State = defaultState, action: InitAction | Action) => produce(state, draft => {
    switch (action.type) {
        case system.INIT: {
            draft.isHidden = action.payload.ui.editModePanel.isHidden || true;
            break;
        }
        case actionTypes.TOGGLE: {
            draft.isHidden = !draft.isHidden;
            break;
        }
    }
});

export const reducer = (globalState: GlobalState, action: InitAction | Action) => {
    // TODO: substitute global state with State when conversion of all UI reducers is done
    const state = $get(['ui', 'editModePanel'], globalState) || undefined;
    const newState = subReducer(state, action);
    return $set(['ui', 'editModePanel'], newState, globalState);
};

//
// Export the selectors
//
export const selectors = {};
