import test from 'ava';
import Immutable, {Map} from 'immutable';

import {actionTypes as system} from '../../System/index';

import {actionTypes, actions, reducer} from './index.js';

test(`should export actionTypes`, t => {
    t.not(actionTypes, undefined);
    t.is(typeof (actionTypes.TOGGLE), 'string');
    t.is(typeof (actionTypes.HIDE), 'string');
});

test(`should export action creators`, t => {
    t.not(actions, undefined);
    t.is(typeof (actions.toggle), 'function');
    t.is(typeof (actions.hide), 'function');
});

test(`should export a reducer`, t => {
    t.not(reducer, undefined);
    t.is(typeof (reducer), 'function');
});

test(`The reducer should return an Immutable.Map as the initial state.`, t => {
    const state = new Map({});
    const nextState = reducer(state, {
        type: system.INIT
    });

    t.true(nextState.get('ui').get('drawer') instanceof Map);
});

test(`The reducer should initially mark the drawer container as hidden.`, t => {
    const state = new Map({});
    const nextState = reducer(state, {
        type: system.INIT
    });

    t.true(nextState.get('ui').get('drawer').get('isHidden'));
});

test(`The "toggle" action should be able to reverse the value of the "isHidden" key.`, t => {
    const state = Immutable.fromJS({
        ui: {
            drawer: {
                isHidden: true
            }
        }
    });
    const nextState1 = reducer(state, actions.toggle());
    const nextState2 = reducer(nextState1, actions.toggle());

    t.false(nextState1.get('ui').get('drawer').get('isHidden'));
    t.true(nextState2.get('ui').get('drawer').get('isHidden'));
});

test(`The "hide" action should set the "isHidden" key to "true".`, t => {
    const state = Immutable.fromJS({
        ui: {
            drawer: {
                isHidden: false
            }
        }
    });
    const nextState1 = reducer(state, actions.hide());
    const nextState2 = reducer(nextState1, actions.hide());

    t.true(nextState1.get('ui').get('drawer').get('isHidden'));
    t.true(nextState2.get('ui').get('drawer').get('isHidden'));
});
