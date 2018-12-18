import produce from 'immer';
import {action as createAction, ActionType} from 'typesafe-actions';
import {$get, $set} from 'plow-js';

import {InitAction, GlobalState} from '@neos-project/neos-ui-redux-store/src/System';

export interface State extends Readonly<{
    isFullScreen: boolean;
}> {}

export const defaultState: State = {
    isFullScreen: false
};

//
// Export the action types
//
export enum actionTypes {
    TOGGLE = '@neos/neos-ui/UI/FullScreen/TOGGLE'
}

/**
 * Toggles the fullscreen mode on/off.
 */
const toggle = () => createAction(actionTypes.TOGGLE);

//
// Export the actions
//
export const actions = {
    toggle
};

export type Action = ActionType<typeof actions>;

//
// Export the reducer
//
export const subReducer = (state: State = defaultState, action: InitAction | Action) => produce(state, draft => {
    switch (action.type) {
        case actionTypes.TOGGLE: {
            draft.isFullScreen = !draft.isFullScreen;
            break;
        }
    }
});

export const reducer = (globalState: GlobalState, action: InitAction | Action) => {
    // TODO: substitute global state with State when conversion of all UI reducers is done
    const state = $get(['ui', 'fullScreen'], globalState) || undefined;
    const newState = subReducer(state, action);
    return $set(['ui', 'fullScreen'], newState, globalState);
};


//
// Export the selectors
//
export const selectors = {};
