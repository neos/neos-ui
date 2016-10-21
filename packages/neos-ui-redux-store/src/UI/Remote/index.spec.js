import test from 'ava';
import Immutable, {Map} from 'immutable';

import {handleActions} from '@neos-project/utils-redux';

import {actionTypes, actions, reducer} from './index.js';

import {actionTypes as system} from '../../System/index';

test(`should export actionTypes`, t => {
    t.not(actionTypes, undefined);
    t.is(typeof (actionTypes.START_SAVING), 'string');
    t.is(typeof (actionTypes.FINISH_SAVING), 'string');
    t.is(typeof (actionTypes.START_PUBLISHING), 'string');
    t.is(typeof (actionTypes.FINISH_PUBLISHING), 'string');
    t.is(typeof (actionTypes.START_DISCARDING), 'string');
    t.is(typeof (actionTypes.FINISH_DISCARDING), 'string');
});

test(`should export action creators`, t => {
    t.not(actions, undefined);
    t.is(typeof (actions.startSaving), 'function');
    t.is(typeof (actions.finishSaving), 'function');
    t.is(typeof (actions.startPublishing), 'function');
    t.is(typeof (actions.finishPublishing), 'function');
    t.is(typeof (actions.startDiscarding), 'function');
    t.is(typeof (actions.finishDiscarding), 'function');
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

    t.true(nextState.get('ui').get('remote') instanceof Map);
});

test(`should initially mark the remote states as inactive.`, t => {
    const state = new Map({});
    const nextState = reducer(state, {
        type: system.INIT
    });

    t.false(nextState.get('ui').get('remote').get('isSaving'));
    t.false(nextState.get('ui').get('remote').get('isPublishing'));
    t.false(nextState.get('ui').get('remote').get('isDiscarding'));
});

test(`The "startSaving" action should set the value of the "isSaving" key to "true"`, t => {
    const state = Immutable.fromJS({
        ui: {
            remote: {
                isSaving: false
            }
        }
    });
    const nextState1 = reducer(state, actions.startSaving());
    const nextState2 = reducer(nextState1, actions.startSaving());

    t.true(nextState1.get('ui').get('remote').get('isSaving'));
    t.true(nextState2.get('ui').get('remote').get('isSaving'));
});

test(`The "finishSaving" action should set the value of the "isSaving" key to "false"`, t => {
    const state = Immutable.fromJS({
        ui: {
            remote: {
                isSaving: true
            }
        }
    });
    const nextState1 = reducer(state, actions.finishSaving());
    const nextState2 = reducer(nextState1, actions.finishSaving());

    t.false(nextState1.get('ui').get('remote').get('isSaving'));
    t.false(nextState2.get('ui').get('remote').get('isSaving'));
});

test(`The "startPublishing" action should set the value of the "isPublishing" key to "true"`, t => {
    const state = Immutable.fromJS({
        ui: {
            remote: {
                isPublishing: false
            }
        }
    });
    const nextState1 = reducer(state, actions.startPublishing());
    const nextState2 = reducer(nextState1, actions.startPublishing());

    t.true(nextState1.get('ui').get('remote').get('isPublishing'));
    t.true(nextState2.get('ui').get('remote').get('isPublishing'));
});

test(`The "finishPublishing" action should set the value of the "isPublishing" key to "false"`, t => {
    const state = Immutable.fromJS({
        ui: {
            remote: {
                isPublishing: true
            }
        }
    });
    const nextState1 = reducer(state, actions.finishPublishing());
    const nextState2 = reducer(nextState1, actions.finishPublishing());

    t.false(nextState1.get('ui').get('remote').get('isPublishing'));
    t.false(nextState2.get('ui').get('remote').get('isPublishing'));
});

test(`The "startDiscarding" action should set the value of the "isDiscarding" key to "true"`, t => {
    const state = Immutable.fromJS({
        ui: {
            remote: {
                isDiscarding: false
            }
        }
    });
    const nextState1 = reducer(state, actions.startDiscarding());
    const nextState2 = reducer(nextState1, actions.startDiscarding());

    t.true(nextState1.get('ui').get('remote').get('isDiscarding'));
    t.true(nextState2.get('ui').get('remote').get('isDiscarding'));
});

test(`The "finishDiscarding" action should set the value of the "isDiscarding" key to "false"`, t => {
    const state = Immutable.fromJS({
        ui: {
            remote: {
                isDiscarding: true
            }
        }
    });
    const nextState1 = reducer(state, actions.finishDiscarding());
    const nextState2 = reducer(nextState1, actions.finishDiscarding());

    t.false(nextState1.get('ui').get('remote').get('isDiscarding'));
    t.false(nextState2.get('ui').get('remote').get('isDiscarding'));
});
