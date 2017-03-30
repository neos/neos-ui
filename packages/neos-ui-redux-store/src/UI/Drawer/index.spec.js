import Immutable, {Map} from 'immutable';

import {actionTypes as system} from '../../System/index';

import {actionTypes, actions, reducer} from './index.js';

test(`should export actionTypes`, () => {
    expect(actionTypes).not.toBe(undefined);
    expect(typeof (actionTypes.TOGGLE)).toBe('string');
    expect(typeof (actionTypes.HIDE)).toBe('string');
});

test(`should export action creators`, () => {
    expect(actions).not.toBe(undefined);
    expect(typeof (actions.toggle)).toBe('function');
    expect(typeof (actions.hide)).toBe('function');
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

    expect(nextState.get('ui').get('drawer') instanceof Map).toBe(true);
});

test(`The reducer should initially mark the drawer container as hidden.`, () => {
    const state = new Map({});
    const nextState = reducer(state, {
        type: system.INIT
    });

    expect(nextState.get('ui').get('drawer').get('isHidden')).toBe(true);
});

test(`The "toggle" action should be able to reverse the value of the "isHidden" key.`, () => {
    const state = Immutable.fromJS({
        ui: {
            drawer: {
                isHidden: true
            }
        }
    });
    const nextState1 = reducer(state, actions.toggle());
    const nextState2 = reducer(nextState1, actions.toggle());

    expect(nextState1.get('ui').get('drawer').get('isHidden')).toBe(false);
    expect(nextState2.get('ui').get('drawer').get('isHidden')).toBe(true);
});

test(`The "hide" action should set the "isHidden" key to "true".`, () => {
    const state = Immutable.fromJS({
        ui: {
            drawer: {
                isHidden: false
            }
        }
    });
    const nextState1 = reducer(state, actions.hide());
    const nextState2 = reducer(nextState1, actions.hide());

    expect(nextState1.get('ui').get('drawer').get('isHidden')).toBe(true);
    expect(nextState2.get('ui').get('drawer').get('isHidden')).toBe(true);
});
