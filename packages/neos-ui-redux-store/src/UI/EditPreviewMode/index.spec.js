import test from 'ava';
import Immutable from 'immutable';

import {actionTypes, actions, reducer} from './index.js';

import {actions as system} from '../../System/index';

test(`should export actionTypes`, t => {
    t.not(actionTypes, undefined);
    t.is(typeof (actionTypes.SET), 'string');
});

test(`should export action creators`, t => {
    t.not(actions, undefined);
    t.is(typeof (actions.set), 'function');
});

test(`should export a reducer`, t => {
    t.not(reducer, undefined);
    t.is(typeof (reducer), 'function');
});

test(`The reducer should initialize from the init action payload.`, t => {
    const state = Immutable.fromJS({ui: {editPreviewMode: undefined}});
    const nextState = reducer(state, system.init({ui: {editPreviewMode: 'bar'}}));

    t.is(nextState.get('ui').get('editPreviewMode'), 'bar');
});

test(`
    The "set" action should set the edit preview mode`, t => {
    const state = Immutable.fromJS({
        ui: {
            editPreviewMode: 'bar'
        }
    });
    const nextState = reducer(state, actions.set('baz'));

    t.is(nextState.get('ui').get('editPreviewMode'), 'baz');
});
