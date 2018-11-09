import {actionTypes, actions, reducer, defaultState, selectors} from './index';

test(`should export actionTypes`, () => {
    expect(actionTypes).not.toBe(undefined);
    expect(typeof (actionTypes.BOOT)).toBe('string');
    expect(typeof (actionTypes.INIT)).toBe('string');
    expect(typeof (actionTypes.READY)).toBe('string');
    expect(typeof (actionTypes.AUTHENTICATION_TIMEOUT)).toBe('string');
    expect(typeof (actionTypes.REAUTHENTICATION_SUCCEEDED)).toBe('string');
});

test(`should export action creators`, () => {
    expect(actions).not.toBe(undefined);
    expect(typeof (actions.boot)).toBe('function');
    expect(typeof (actions.init)).toBe('function');
    expect(typeof (actions.ready)).toBe('function');
    expect(typeof (actions.authenticationTimeout)).toBe('function');
    expect(typeof (actions.reauthenticationSucceeded)).toBe('function');

    expect(typeof (actions.boot().type)).toBe('string');
    expect(typeof (actions.init().type)).toBe('string');
    expect(typeof (actions.ready().type)).toBe('string');
    expect(typeof (actions.authenticationTimeout().type)).toBe('string');
    expect(typeof (actions.reauthenticationSucceeded().type)).toBe('string');
});

test(`should export a reducer`, () => {
    expect(reducer).not.toBe(undefined);
    expect(typeof (reducer)).toBe('function');
});

test(`The reducer should return the default state when called with undefined.`, () => {
    const nextState = reducer(undefined, {
        type: 'unknown'
    });

    expect(nextState).toBe(defaultState);
});

test(`The "authenticationTimeout" and "reauthenticationSucceeded" actions should toggle the "authenticationTimeout" key.`, () => {
    const state = {
        authenticationTimeout: false
    };
    const nextState1 = reducer(state, actions.authenticationTimeout());
    const nextState2 = reducer(nextState1, actions.reauthenticationSucceeded());

    expect(nextState1.authenticationTimeout).toBe(true);
    expect(nextState2.authenticationTimeout).toBe(false);
});

test(`The "authenticationTimeout" selector`, () => {
    const state = {
        system: {
            authenticationTimeout: true
        }
    };
    const authenticationTimeoutValue = selectors.authenticationTimeout(state);

    expect(authenticationTimeoutValue).toBe(true);
});
