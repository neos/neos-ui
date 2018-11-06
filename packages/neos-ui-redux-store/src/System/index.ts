import {handleActions} from '@neos-project/utils-redux';
import produce from 'immer';
import {$get} from 'plow-js';
import {createAction} from 'typesafe-actions';

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

const boot = createAction(BOOT);
const init = createAction(INIT, resolve => (state: State) => resolve(state));
const ready = createAction(READY);
const authenticationTimeout = createAction(AUTHENTICATION_TIMEOUT);
const reauthenticationSucceeded = createAction(REAUTHENTICATION_SUCCEEDED);

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

//
// Export the reducer
//
export const reducer = handleActions({
    [INIT]: () => (): State => ({
        authenticationTimeout: false
    }),
    [AUTHENTICATION_TIMEOUT]: () => (state: State) => produce(state, draft => {
        draft.authenticationTimeout = true;
    }),
    [REAUTHENTICATION_SUCCEEDED]: () => (state: State) => produce(state, draft => {
        draft.authenticationTimeout = false;
    })
});

//
// Export the selectors
//
export const selectors = {
    authenticationTimeout: (state: any) => $get(['system'], state).authenticationTimeout
};
