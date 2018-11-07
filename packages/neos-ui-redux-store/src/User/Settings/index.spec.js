import {actionTypes, actions, reducer, defaultState} from './index';
import {actionTypes as system} from '../../System/index';

test(`should export actionTypes`, () => {
    expect(actionTypes).not.toBe(undefined);
    expect(typeof (actionTypes.TOGGLE_AUTO_PUBLISHING)).toBe('string');
});

test(`should export action creators`, () => {
    expect(actions).not.toBe(undefined);
    expect(typeof (actions.toggleAutoPublishing)).toBe('function');
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

test(`The reducer should correctly rehydrate data on INIT.`, () => {
    const initValues = {
        isAutoPublishingEnabled: true
    };
    const nextState = reducer(undefined, {
        type: system.INIT,
        payload: {
            user: {
                settings: initValues
            }
        }
    });
    expect(nextState).toEqual(initValues);
});

test(`
    The "toggle" action should be able to reverse the value of the
    "isAutoPublishingEnabled" key.`, () => {
    const state = {
        isAutoPublishingEnabled: false
    };
    const nextState1 = reducer(state, actions.toggleAutoPublishing());
    const nextState2 = reducer(nextState1, actions.toggleAutoPublishing());

    expect(nextState1.isAutoPublishingEnabled).toBe(true);
    expect(nextState2.isAutoPublishingEnabled).toBe(false);
});
