import produce from 'immer';
import {$get} from 'plow-js';
import {action as createAction, ActionType} from 'typesafe-actions';
import {State as UIState} from './../UI/index';
import {State as UserState} from './../User/index';
import {State as CRState} from './../CR/index';

//
// Export the subreducer state shape interface
//
export interface State {
    readonly authenticationTimeout: boolean;
}

// TODO: move up when possible
export interface GlobalState {
    system: State;
    user: UserState;
    cr: CRState;
    ui: UIState;
}

export const defaultState: State = {
    authenticationTimeout: false
};

//
// Export the action types
//
export enum actionTypes {
    BOOT = '@neos/neos-ui/System/BOOT',
    INIT = '@neos/neos-ui/System/INIT',
    READY = '@neos/neos-ui/System/READY',
    AUTHENTICATION_TIMEOUT = '@neos/neos-ui/System/AUTHENTICATION_TIMEOUT',
    REAUTHENTICATION_SUCCEEDED = '@neos/neos-ui/System/REAUTHENTICATION_SUCCEEDED'
}

//
// Export the actions
//
export const actions = {
    boot: () => createAction(actionTypes.BOOT),
    init: (state: GlobalState) => createAction(actionTypes.INIT, state),
    ready: () => createAction(actionTypes.READY),
    authenticationTimeout: () => createAction(actionTypes.AUTHENTICATION_TIMEOUT),
    reauthenticationSucceeded: () => createAction(actionTypes.REAUTHENTICATION_SUCCEEDED)
};

export type InitAction = ActionType<typeof actions.init>;

//
// Export the union type of all actions
//
export type Action = ActionType<typeof actions>;

//
// Export the reducer
//
export const reducer = (state: State = defaultState, action: Action) => produce(state, draft => {
    switch (action.type) {
        case actionTypes.AUTHENTICATION_TIMEOUT:
            draft.authenticationTimeout = true;
            break;
        case actionTypes.REAUTHENTICATION_SUCCEEDED:
            draft.authenticationTimeout = false;
            break;
    }
});

//
// Export the selectors
//
export const selectors = {
    authenticationTimeout: (state: any) => $get(['system'], state).authenticationTimeout
};
