import {actionTypes as system} from '../../System/index';

import {actionTypes, actions, errorMessages, reducer} from './index';

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

test(`The reducer should return a plain object as the initial state.`, () => {
    const state = {};
    const nextState = reducer(state, {
        type: system.INIT,
        payload: {
            ui: {
                addNodeModal: {}
            }
        }
    });

    expect(typeof nextState).toBe('object');
});

test(`The reducer should initially indicate a closed modal`, () => {
    const state = undefined;
    const nextState = reducer(state, {
        type: system.INIT,
        payload: {
            ui: {
                addNodeModal: {}
            }
        }
    });

    expect(nextState.contextPath).toBe(null);
    expect(nextState.fusionPath).toBe(null);
});

test(`The "open" action should set "contextPath" key.`, () => {
    const state = undefined;
    const nextState = reducer(state, actions.open('someContextPath'));

    expect(nextState.contextPath).toBe('someContextPath');
});

test(`The "open" action should set "fusionPath" key.`, () => {
    const state = undefined;
    const nextState = reducer(state, actions.open('someContextPath', 'someFusionPath'));

    expect(nextState.fusionPath).toBe('someFusionPath');
});

test(`The "open" action should throw on invalid contextPath.`, () => {
    const state = undefined;
    const fn = () => reducer(state, actions.open(null));

    expect(fn).toThrowError(errorMessages.ERROR_INVALID_CONTEXTPATH);
});

test(`The "open" action should throw on invalid fusionPath.`, () => {
    const state = undefined;
    const fn = () => reducer(state, actions.open('someContextPath', null));

    expect(fn).toThrowError(errorMessages.ERROR_INVALID_FUSIONPATH);
});

test(`The "close" action should set "isOpen" key to false.`, () => {
    const state = {
        contextPath: 'someContextPath',
        fusionPath: 'someFusionPath'
    };
    const nextState = reducer(state, actions.close());

    expect(nextState.contextPath).toBe(null);
    expect(nextState.fusionPath).toBe(null);
});

test(`The "toggleGroup" action should work with fresh state.`, () => {
    const state = {
        toggledGroups: []
    };
    const nextState = reducer(state, actions.toggleGroup('test'));

    expect(nextState.toggledGroups).toEqual(['test']);
});

test(`The "toggleGroup" action should toggle set group.`, () => {
    const state = {
        toggledGroups: []
    };
    const nextState1 = reducer(state, actions.toggleGroup('test'));
    const nextState2 = reducer(nextState1, actions.toggleGroup('test'));

    expect(nextState2.toggledGroups).toEqual([]);
});

test(`The "toggleGroup" action should work with multiple groups.`, () => {
    const state = {
        toggledGroups: []
    };
    const nextState1 = reducer(state, actions.toggleGroup('test1'));
    const nextState2 = reducer(nextState1, actions.toggleGroup('test2'));
    const nextState3 = reducer(nextState2, actions.toggleGroup('test1'));
    const nextState4 = reducer(nextState3, actions.toggleGroup('test2'));

    expect(nextState1.toggledGroups).toEqual(['test1']);
    expect(nextState2.toggledGroups).toEqual(['test1', 'test2']);
    expect(nextState3.toggledGroups).toEqual(['test2']);
    expect(nextState4.toggledGroups).toEqual([]);
});
