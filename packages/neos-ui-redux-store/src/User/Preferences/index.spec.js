import {Map} from 'immutable';

import {reducer} from './index';

import {actionTypes as system} from '../../System/index';

test(`should export a reducer`, () => {
    expect(reducer).not.toBe(undefined);
    expect(typeof (reducer)).toBe('function');
});

test(`The reducer should return an Immutable.Map as the initial state.`, () => {
    const state = new Map({});
    const nextState = reducer(state, {
        type: system.INIT
    });

    expect(nextState.get('user').get('preferences') instanceof Map).toBe(true);
});
