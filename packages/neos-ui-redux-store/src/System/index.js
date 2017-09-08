import {createAction} from 'redux-actions';
import {Map} from 'immutable';
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
const init = createAction(INIT, state => state);
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

//
// Export the reducer
//
export const reducer = handleActions({
    [INIT]: state => $set(
        'system',
        new Map({
            authenticationTimeout: false
        })
    ),
    [AUTHENTICATION_TIMEOUT]: () => $set('system.authenticationTimeout', true),
    [REAUTHENTICATION_SUCCEEDED]: () => $set('system.authenticationTimeout', false)
});

//
// Export the selectors
//
export const selectors = {
    authenticationTimeout: $get('system.authenticationTimeout')
};
