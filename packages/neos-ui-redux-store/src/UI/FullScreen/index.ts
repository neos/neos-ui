import produce from 'immer';
import {action as createAction, ActionType} from 'typesafe-actions';

import {InitAction} from '@neos-project/neos-ui-redux-store/src/System';

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
export const reducer = (state: State = defaultState, action: InitAction | Action) => produce(state, draft => {
    switch (action.type) {
        case actionTypes.TOGGLE: {
            draft.isFullScreen = !draft.isFullScreen;
            break;
        }
    }
});

//
// Export the selectors
//
export const selectors = {};
