import produce from 'immer';
import {action as createAction, ActionType} from 'typesafe-actions';

import {InitAction} from '@neos-project/neos-ui-redux-store/src/System';

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
export const reducer = (state: State = defaultState, action: InitAction | Action) => produce(state, draft => {
    switch (action.type) {
        case actionTypes.TOGGLE: {
            draft.isHidden = !draft.isHidden;
            break;
        }
    }
});

//
// Export the selectors
//
export const selectors = {};
