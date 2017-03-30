import Immutable, {Map} from 'immutable';

import {actionTypes, actions, reducer} from './index.js';

import {actionTypes as system} from '../../System/index';

test(`should export actionTypes`, () => {
    expect(actionTypes).not.toBe(undefined);
    expect(typeof (actionTypes.TOGGLE)).toBe('string');
});

test(`should export action creators`, () => {
    expect(actions).not.toBe(undefined);
    expect(typeof (actions.toggle)).toBe('function');
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

    expect(nextState.get('ui').get('leftSideBar') instanceof Map).toBe(true);
});

test(`The reducer should initially mark the sidebar as visible.`, () => {
    const state = new Map({});
    const nextState = reducer(state, {
        type: system.INIT
    });

    expect(nextState.get('ui').get('leftSideBar').get('isHidden')).toBe(false);
});

test(`
    The "toggle" action should be able to reverse the value of the
    "isHidden" key.`, () => {
    const state = Immutable.fromJS({
        ui: {
            leftSideBar: {
                isHidden: false
            }
        }
    });
    const nextState1 = reducer(state, actions.toggle());
    const nextState2 = reducer(nextState1, actions.toggle());

    expect(nextState1.get('ui').get('leftSideBar').get('isHidden')).toBe(true);
    expect(nextState2.get('ui').get('leftSideBar').get('isHidden')).toBe(false);
});
