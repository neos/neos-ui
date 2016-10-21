import test from 'ava';
import Immutable, {Map} from 'immutable';

import {reducer} from './index.js';

import {actionTypes as system} from '../../System/index';

test(`should export a reducer`, t => {
    t.not(reducer, undefined);
    t.is(typeof (reducer), 'function');
});

test(`The reducer should return an Immutable.Map as the initial state.`, t => {
    const state = new Map({});
    const nextState = reducer(state, {
        type: system.INIT
    });

    t.true(nextState.get('user').get('name') instanceof Map);
});

test(`The reducer should initially create placeholder data.`, t => {
    const state = new Map({});
    const nextState = reducer(state, {
        type: system.INIT
    });

    t.deepEqual(nextState.get('user').get('name').toJS(), {
        title: '',
        firstName: '',
        middleName: '',
        lastName: '',
        otherName: '',
        fullName: ''
    });
});
