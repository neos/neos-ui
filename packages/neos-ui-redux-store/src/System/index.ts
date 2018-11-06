import produce from 'immer';
import {$get} from 'plow-js';
import {action as createAction, ActionType as ActionTypeHelper} from 'typesafe-actions';

const BOOT = '@neos/neos-ui/System/BOOT';
const INIT = '@neos/neos-ui/System/INIT';
const READY = '@neos/neos-ui/System/READY';
const AUTHENTICATION_TIMEOUT = '@neos/neos-ui/System/AUTHENTICATION_TIMEOUT';
const REAUTHENTICATION_SUCCEEDED = '@neos/neos-ui/System/REAUTHENTICATION_SUCCEEDED';

//
// Export the action types
//
export const actionTypes = {
    AUTHENTICATION_TIMEOUT,
    BOOT,
    INIT,
    READY,
    REAUTHENTICATION_SUCCEEDED
};

interface State {
    readonly authenticationTimeout: boolean;
}

const boot = () => createAction(BOOT);
const init = (state: State) => createAction(INIT, state);
const ready = () => createAction(READY);
const authenticationTimeout = () => createAction(AUTHENTICATION_TIMEOUT);
const reauthenticationSucceeded = () => createAction(REAUTHENTICATION_SUCCEEDED);

//
// Export the actions
//
export const actions = {
    authenticationTimeout,
    boot,
    init,
    ready,
    reauthenticationSucceeded
};

export type ActionType = ActionTypeHelper<typeof actions>;

const defaultState: State = {
    authenticationTimeout: false
};

//
// Export the reducer
//
export const reducer = (state: State = defaultState, action: ActionType) => {
    return produce(state, draft => {
        switch (action.type) {
            case INIT:
                draft.authenticationTimeout = false;
                break;
            case AUTHENTICATION_TIMEOUT:
                draft.authenticationTimeout = true;
                break;
            case REAUTHENTICATION_SUCCEEDED:
                draft.authenticationTimeout = false;
                break;
        }
    });
};

//
// Export the selectors
//
export const selectors = {
    authenticationTimeout: (state: any) => $get(['system'], state).authenticationTimeout
};
