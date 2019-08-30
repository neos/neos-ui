import produce from 'immer';
import {action as createAction, ActionType} from 'typesafe-actions';
import {actionTypes as system, InitAction} from '../../System';
import {State as UserState} from './../index';

//
// Export the subreducer state shape interface
//
export interface State extends Readonly<{
    isAutoPublishingEnabled: boolean;
    isPublishingModeAll: boolean;
}> {}

export const defaultState: State = {
    isAutoPublishingEnabled: false,
    isPublishingModeAll: false
};

//
// Export the action types
//
export enum actionTypes {
    TOGGLE_AUTO_PUBLISHING = '@neos/neos-ui/User/Settings/TOGGLE_AUTO_PUBLISHING',
    TOGGLE_PUBLISHING_MODE_ALL = '@neos/neos-ui/User/Settings/TOGGLE_PUBLISHING_MODE_ALL'
}

//
// Export the actions
//
export const actions = {
    /**
     * Toggles the publishing modes for the current logged in user.
     */
    toggleAutoPublishing: (state: UserState) => createAction(actionTypes.TOGGLE_AUTO_PUBLISHING, state),
    togglePublishingModeAll: (state: UserState) => createAction(actionTypes.TOGGLE_PUBLISHING_MODE_ALL, state)
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
            draft.isPublishingModeAll = action.payload.user.settings.isPublishingModeAll;
            break;
        case actionTypes.TOGGLE_AUTO_PUBLISHING:
            draft.isAutoPublishingEnabled = !state.isAutoPublishingEnabled;
            break;
        case actionTypes.TOGGLE_PUBLISHING_MODE_ALL:
            draft.isPublishingModeAll = !state.isPublishingModeAll;
            break;
    }
});

//
// Export the selectors
//
export const selectors = {};
