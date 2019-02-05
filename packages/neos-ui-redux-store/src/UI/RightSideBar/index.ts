import produce from 'immer';
import {action as createAction, ActionType} from 'typesafe-actions';
import {$get} from 'plow-js';

import {actionTypes as system, InitAction, GlobalState} from '@neos-project/neos-ui-redux-store/src/System';

export interface State extends Readonly<{
    isHidden: boolean;
}> {}

export const defaultState: State = {
    isHidden: false
};

//
// Export the action types
//
export enum actionTypes {
    TOGGLE = '@neos/neos-ui/UI/RightSidebar/TOGGLE'
}

/**
 * Toggles the right sidebar out/in of the users viewport.
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
        case system.INIT: {
            draft.isHidden = $get(['payload', 'ui', 'rightSideBar', 'isHidden'], action) || false;
            break;
        }
        case actionTypes.TOGGLE: {
            draft.isHidden = !draft.isHidden;
            break;
        }
    }
});

//
// Export the selectors
//
export const selectors = {
    isHidden: (state: GlobalState) => $get(['ui', 'rightSideBar', 'isHidden'], state)
};
