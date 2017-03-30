import Immutable, {Map} from 'immutable';

import {actionTypes, actions, reducer} from './index.js';

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

test(`The reducer should return an Immutable.Map as the initial state.`, () => {
    const state = new Map({});
    const nextState = reducer(state, {
        type: system.INIT
    });

    expect(nextState.get('user').get('settings') instanceof Map).toBe(true);
});

test(`The reducer should initially mark auto publishing as disabled.`, () => {
    const state = new Map({});
    const nextState = reducer(state, {
        type: system.INIT
    });

    expect(nextState.get('user').get('settings').get('isAutoPublishingEnabled')).toBe(false);
});

test(`
    The "toggle" action should be able to reverse the value of the
    "isAutoPublishingEnabled" key.`, () => {
    const state = Immutable.fromJS({
        user: {
            settings: {
                isAutoPublishingEnabled: false
            }
        }
    });
    const nextState1 = reducer(state, actions.toggleAutoPublishing());
    const nextState2 = reducer(nextState1, actions.toggleAutoPublishing());

    expect(nextState1.get('user').get('settings').get('isAutoPublishingEnabled')).toBe(true);
    expect(nextState2.get('user').get('settings').get('isAutoPublishingEnabled')).toBe(false);
});
