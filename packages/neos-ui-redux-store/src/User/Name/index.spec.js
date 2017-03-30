import {Map} from 'immutable';

import {reducer} from './index.js';

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

    expect(nextState.get('user').get('name') instanceof Map).toBe(true);
});

test(`The reducer should initially create placeholder data.`, () => {
    const state = new Map({});
    const nextState = reducer(state, {
        type: system.INIT
    });

    expect(nextState.get('user').get('name').toJS()).toEqual({
        title: '',
        firstName: '',
        middleName: '',
        lastName: '',
        otherName: '',
        fullName: ''
    });
});
