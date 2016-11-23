import test from 'ava';
import Immutable, {Map} from 'immutable';

import {actionTypes, actions, reducer} from './index.js';

import {actionTypes as system} from '../../System/index';

test(`should export actionTypes`, t => {
    t.not(actionTypes, undefined);
    t.is(typeof (actionTypes.TOGGLE_AUTO_PUBLISHING), 'string');
});

test(`should export action creators`, t => {
    t.not(actions, undefined);
    t.is(typeof (actions.toggleAutoPublishing), 'function');
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

    t.true(nextState.get('user').get('settings') instanceof Map);
});

test(`The reducer should initially mark auto publishing as disabled.`, t => {
    const state = new Map({});
    const nextState = reducer(state, {
        type: system.INIT
    });

    t.false(nextState.get('user').get('settings').get('isAutoPublishingEnabled'));
});

test(`
    The "toggle" action should be able to reverse the value of the
    "isAutoPublishingEnabled" key.`, t => {
    const state = Immutable.fromJS({
        user: {
            settings: {
                isAutoPublishingEnabled: false
            }
        }
    });
    const nextState1 = reducer(state, actions.toggleAutoPublishing());
    const nextState2 = reducer(nextState1, actions.toggleAutoPublishing());

    t.true(nextState1.get('user').get('settings').get('isAutoPublishingEnabled'));
    t.false(nextState2.get('user').get('settings').get('isAutoPublishingEnabled'));
});
