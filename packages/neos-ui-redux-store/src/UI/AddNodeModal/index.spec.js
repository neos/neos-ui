import Immutable, {Map} from 'immutable';

import {actionTypes as system} from '../../System/index';

import {actionTypes, actions, errorMessages, reducer} from './index.js';

test(`should export actionTypes`, () => {
    expect(actionTypes).not.toBe(undefined);
    expect(typeof (actionTypes.OPEN)).toBe('string');
    expect(typeof (actionTypes.CLOSE)).toBe('string');
    expect(typeof (actionTypes.TOGGLE_GROUP)).toBe('string');
});

test(`should export action creators`, () => {
    expect(actions).not.toBe(undefined);
    expect(typeof (actions.open)).toBe('function');
    expect(typeof (actions.close)).toBe('function');
    expect(typeof (actions.toggleGroup)).toBe('function');
});

test(`should export errorMessages`, () => {
    expect(errorMessages).not.toBe(undefined);
    expect(typeof (errorMessages.ERROR_INVALID_CONTEXTPATH)).toBe('string');
    expect(typeof (errorMessages.ERROR_INVALID_FUSIONPATH)).toBe('string');
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

    expect(nextState.get('ui').get('addNodeModal') instanceof Map).toBe(true);
});

test(`The reducer should initially indicate a closed modal`, () => {
    const state = new Map({});
    const nextState = reducer(state, {
        type: system.INIT
    });

    expect(nextState.get('ui').get('addNodeModal').get('contextPath')).toBe('');
    expect(nextState.get('ui').get('addNodeModal').get('fusionPath')).toBe('');
});

test(`The "open" action should set "contextPath" key.`, () => {
    const state = new Map({});
    const nextState = reducer(state, actions.open('someContextPath'));

    expect(nextState.get('ui').get('addNodeModal').get('contextPath')).toBe('someContextPath');
});

test(`The "open" action should set "fusionPath" key.`, () => {
    const state = new Map({});
    const nextState = reducer(state, actions.open('someContextPath', 'someFusionPath'));

    expect(nextState.get('ui').get('addNodeModal').get('fusionPath')).toBe('someFusionPath');
});

test(`The "open" action should throw on invalid contextPath.`, () => {
    const state = new Map({});
    const fn = () => reducer(state, actions.open(null));

    expect(fn).toThrowError(errorMessages.ERROR_INVALID_CONTEXTPATH);
});

test(`The "open" action should throw on invalid fusionPath.`, () => {
    const state = new Map({});
    const fn = () => reducer(state, actions.open('someContextPath', null));

    expect(fn).toThrowError(errorMessages.ERROR_INVALID_FUSIONPATH);
});

test(`The "close" action should set "isOpen" key to false.`, () => {
    const state = Immutable.fromJS({
        ui: {
            addNodeModal: {
                contextPath: 'someContextPath',
                fusionPath: 'someFusionPath'
            }
        }
    });
    const nextState = reducer(state, actions.close());

    expect(nextState.get('ui').get('addNodeModal').get('contextPath')).toBe('');
    expect(nextState.get('ui').get('addNodeModal').get('fusionPath')).toBe('');
});

test(`The "toggleGroup" action should work with fresh state.`, () => {
    const state = Immutable.fromJS({
        ui: {
            addNodeModal: {
                collapsedGroups: []
            }
        }
    });
    const nextState = reducer(state, actions.toggleGroup('test'));

    expect(nextState.get('ui').get('addNodeModal').get('collapsedGroups').toJS()).toEqual(['test']);
});

test(`The "toggleGroup" action should toggle set group.`, () => {
    const state = Immutable.fromJS({
        ui: {
            addNodeModal: {
                collapsedGroups: []
            }
        }
    });
    const nextState1 = reducer(state, actions.toggleGroup('test'));
    const nextState2 = reducer(nextState1, actions.toggleGroup('test'));

    expect(nextState2.get('ui').get('addNodeModal').get('collapsedGroups').toJS()).toEqual([]);
});

test(`The "toggleGroup" action should work with multiple groups.`, () => {
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

    expect(nextState1.get('ui').get('addNodeModal').get('collapsedGroups').toJS()).toEqual(['test1']);
    expect(nextState2.get('ui').get('addNodeModal').get('collapsedGroups').toJS()).toEqual(['test1', 'test2']);
    expect(nextState3.get('ui').get('addNodeModal').get('collapsedGroups').toJS()).toEqual(['test2']);
    expect(nextState4.get('ui').get('addNodeModal').get('collapsedGroups').toJS()).toEqual([]);
});
