import produce from 'immer';
import {action as createAction, ActionType} from 'typesafe-actions';

import {actionTypes as system, InitAction} from '../../System';

//
// Export the subreducer state shape interface
//
export interface State extends Readonly<{
    isAutoPublishingEnabled: boolean;
}> {}

export const defaultState: State = {
    isAutoPublishingEnabled: false
};

//
// Export the action types
//
export enum actionTypes {
    TOGGLE_AUTO_PUBLISHING = '@neos/neos-ui/User/Settings/TOGGLE_AUTO_PUBLISHING'
}

//
// Export the actions
//
export const actions = {
    /**
     * Toggles the auto publishing mode for the current logged in user.
     */
    toggleAutoPublishing: () => createAction(actionTypes.TOGGLE_AUTO_PUBLISHING)
};

//
// Export the union type of all actions
//
export type Action = ActionType<typeof actions>;

//
// Export the reducer
//
export const reducer = (state: State = defaultState, action: Action | InitAction) => produce(state, draft => {
    switch (action.type) {
        case system.INIT:
            draft.isAutoPublishingEnabled = action.payload.user.settings.isAutoPublishingEnabled;
            break;
        case actionTypes.TOGGLE_AUTO_PUBLISHING:
            draft.isAutoPublishingEnabled = !state.isAutoPublishingEnabled;
            break;
    }
});

//
// Export the selectors
//
export const selectors = {};
