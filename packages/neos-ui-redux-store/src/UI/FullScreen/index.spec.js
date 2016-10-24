import test from 'ava';
import Immutable, {Map} from 'immutable';

import {actionTypes, actions, reducer} from './index.js';

import {actionTypes as system} from '../../System/index';

test(`should export actionTypes`, t => {
    t.not(actionTypes, undefined);
    t.is(typeof (actionTypes.TOGGLE), 'string');
});

test(`should export action creators`, t => {
    t.not(actions, undefined);
    t.is(typeof (actions.toggle), 'function');
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

    t.true(nextState.get('ui').get('fullScreen') instanceof Map);
});

test(`The reducer should initially set fullscreen mode to off.`, t => {
    const state = new Map({});
    const nextState = reducer(state, {
        type: system.INIT
    });

    t.false(nextState.get('ui').get('fullScreen').get('isFullScreen'));
});

test(`
    The "toggle" action should be able to reverse the value of the
    "isFullScreen" key.`, t => {
    const state = Immutable.fromJS({
        ui: {
            fullScreen: {
                isFullScreen: false
            }
        }
    });
    const nextState1 = reducer(state, actions.toggle());
    const nextState2 = reducer(nextState1, actions.toggle());

    t.true(nextState1.get('ui').get('fullScreen').get('isFullScreen'));
    t.false(nextState2.get('ui').get('fullScreen').get('isFullScreen'));
});
