import {createAction} from 'redux-actions';
import Immutable from 'seamless-immutable';
import {$set, $get} from 'plow-js';
import {handleActions} from '@neos-project/utils-redux';

const BOOT = '@neos/neos-ui/System/BOOT';
const INIT = '@neos/neos-ui/System/INIT';
const READY = '@neos/neos-ui/System/READY';
const AUTHENTICATION_TIMEOUT = '@neos/neos-ui/System/AUTHENTICATION_TIMEOUT';
const REAUTHENTICATION_SUCCEEDED = '@neos/neos-ui/System/REAUTHENTICATION_SUCCEEDED';

//
// Export the action types
//
export const actionTypes = {
    BOOT,
    INIT,
    READY,
    AUTHENTICATION_TIMEOUT,
    REAUTHENTICATION_SUCCEEDED
};

const boot = createAction(BOOT);
const init = createAction(INIT, <S>(state: S): S => state);
const ready = createAction(READY);
const authenticationTimeout = createAction(AUTHENTICATION_TIMEOUT);
const reauthenticationSucceeded = createAction(REAUTHENTICATION_SUCCEEDED);

//
// Export the actions
//
export const actions = {
    boot,
    init,
    ready,
    authenticationTimeout,
    reauthenticationSucceeded
};

export interface State {
    authenticationTimeout: boolean;
}

// TODO: later this RootState would be automatically generated from exported states from sub-reducers
interface RootState {
    system: State
}

//
// Export the reducer
//
export const reducer = handleActions({
    [INIT]: () => (state: RootState) => $set(['system'], Immutable({authenticationTimeout: false}), state),
    [AUTHENTICATION_TIMEOUT]: () => (state: RootState) => $set(['system', 'authenticationTimeout'], true, state),
    [REAUTHENTICATION_SUCCEEDED]: () => (state: RootState) => $set(['system', 'authenticationTimeout'], false, state)
});

//
// Export the selectors
//
export const selectors = {
    authenticationTimeout: () => (state: RootState) => $get(['system', 'authenticationTimeout'], state)
};
