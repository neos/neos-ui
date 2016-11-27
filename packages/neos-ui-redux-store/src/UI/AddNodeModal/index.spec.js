import test from 'ava';
import Immutable, {Map} from 'immutable';

import {actionTypes as system} from '../../System/index';

import {actionTypes, actions, errorMessages, reducer} from './index.js';

test(`should export actionTypes`, t => {
    t.not(actionTypes, undefined);
    t.is(typeof (actionTypes.OPEN), 'string');
    t.is(typeof (actionTypes.CLOSE), 'string');
    t.is(typeof (actionTypes.TOGGLE_GROUP), 'string');
});

test(`should export action creators`, t => {
    t.not(actions, undefined);
    t.is(typeof (actions.open), 'function');
    t.is(typeof (actions.close), 'function');
    t.is(typeof (actions.toggleGroup), 'function');
});

test(`should export errorMessages`, t => {
    t.not(errorMessages, undefined);
    t.is(typeof (errorMessages.ERROR_INVALID_CONTEXTPATH), 'string');
    t.is(typeof (errorMessages.ERROR_INVALID_FUSIONPATH), 'string');
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

    t.true(nextState.get('ui').get('addNodeModal') instanceof Map);
});

test(`The reducer should initially indicate a closed modal`, t => {
    const state = new Map({});
    const nextState = reducer(state, {
        type: system.INIT
    });

    t.is(nextState.get('ui').get('addNodeModal').get('contextPath'), '');
    t.is(nextState.get('ui').get('addNodeModal').get('fusionPath'), '');
});

test(`The "open" action should set "contextPath" key.`, t => {
    const state = new Map({});
    const nextState = reducer(state, actions.open('someContextPath'));

    t.is(nextState.get('ui').get('addNodeModal').get('contextPath'), 'someContextPath');
});

test(`The "open" action should set "fusionPath" key.`, t => {
    const state = new Map({});
    const nextState = reducer(state, actions.open('someContextPath', 'someFusionPath'));

    t.is(nextState.get('ui').get('addNodeModal').get('fusionPath'), 'someFusionPath');
});

test(`The "open" action should throw on invalid contextPath.`, t => {
    const state = new Map({});
    const fn = () => reducer(state, actions.open(null));

    t.throws(fn, errorMessages.ERROR_INVALID_CONTEXTPATH);
});

test(`The "open" action should throw on invalid fusionPath.`, t => {
    const state = new Map({});
    const fn = () => reducer(state, actions.open('someContextPath', null));

    t.throws(fn, errorMessages.ERROR_INVALID_FUSIONPATH);
});

test(`The "close" action should set "isOpen" key to false.`, t => {
    const state = Immutable.fromJS({
        ui: {
            addNodeModal: {
                contextPath: 'someContextPath',
                fusionPath: 'someFusionPath'
            }
        }
    });
    const nextState = reducer(state, actions.close());

    t.is(nextState.get('ui').get('addNodeModal').get('contextPath'), '');
    t.is(nextState.get('ui').get('addNodeModal').get('fusionPath'), '');
});

test(`The "toggleGroup" action should work with fresh state.`, t => {
    const state = Immutable.fromJS({
        ui: {
            addNodeModal: {
                collapsedGroups: []
            }
        }
    });
    const nextState = reducer(state, actions.toggleGroup('test'));

    t.deepEqual(nextState.get('ui').get('addNodeModal').get('collapsedGroups').toJS(), ['test']);
});

test(`The "toggleGroup" action should toggle set group.`, t => {
    const state = Immutable.fromJS({
        ui: {
            addNodeModal: {
                collapsedGroups: []
            }
        }
    });
    const nextState1 = reducer(state, actions.toggleGroup('test'));
    const nextState2 = reducer(nextState1, actions.toggleGroup('test'));

    t.deepEqual(nextState2.get('ui').get('addNodeModal').get('collapsedGroups').toJS(), []);
});

test(`The "toggleGroup" action should work with multiple groups.`, t => {
    const state = Immutable.fromJS({
        ui: {
            addNodeModal: {
                collapsedGroups: []
            }
        }
    });
    const nextState1 = reducer(state, actions.toggleGroup('test1'));
    const nextState2 = reducer(nextState1, actions.toggleGroup('test2'));
    const nextState3 = reducer(nextState2, actions.toggleGroup('test1'));
    const nextState4 = reducer(nextState3, actions.toggleGroup('test2'));

    t.deepEqual(nextState1.get('ui').get('addNodeModal').get('collapsedGroups').toJS(), ['test1']);
    t.deepEqual(nextState2.get('ui').get('addNodeModal').get('collapsedGroups').toJS(), ['test1', 'test2']);
    t.deepEqual(nextState3.get('ui').get('addNodeModal').get('collapsedGroups').toJS(), ['test2']);
    t.deepEqual(nextState4.get('ui').get('addNodeModal').get('collapsedGroups').toJS(), []);
});
