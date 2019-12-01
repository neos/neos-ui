import {actionTypes, actions, reducer} from './index';
import {SelectionModeTypes} from '@neos-project/neos-ts-interfaces';

import {actionTypes as system} from '../../System/index';

test(`should export actionTypes`, () => {
    expect(actionTypes).not.toBe(undefined);
    expect(typeof (actionTypes.FOCUS)).toBe('string');
    expect(typeof (actionTypes.TOGGLE)).toBe('string');
    expect(typeof (actionTypes.INVALIDATE)).toBe('string');
    expect(typeof (actionTypes.REQUEST_CHILDREN)).toBe('string');
});

test(`should export action creators`, () => {
    expect(actions).not.toBe(undefined);
    expect(typeof (actions.focus)).toBe('function');
    expect(typeof (actions.toggle)).toBe('function');
    expect(typeof (actions.invalidate)).toBe('function');
    expect(typeof (actions.requestChildren)).toBe('function');
});

test(`should export a reducer`, () => {
    expect(reducer).not.toBe(undefined);
    expect(typeof (reducer)).toBe('function');
});

test(`The reducer should return a plain JS object as the initial state.`, () => {
    const nextState = reducer(undefined, {
        type: system.INIT,
        payload: {
            ui: {
                pageTree: {}
            },
            cr: {
                nodes: {
                    siteNode: 'siteNode',
                    documentNode: 'documentNode'
                }
            }
        }
    });

    expect(typeof nextState).toBe('object');
});

test(`The "focus" action should set the focused node context path.`, () => {
    const globalState = {
        ui: {
            focused: [],
            toggled: [],
            hidden: [],
            intermediate: [],
            loading: [],
            errors: []
        },
        cr: {
            nodes: {
                siteNode: 'siteNode',
                documentNode: 'documentNode',
                byContextPath: []
            }
        }
    };
    const nextState = reducer(globalState.ui, actions.focus('someOtherContextPath', undefined, SelectionModeTypes.SINGLE_SELECT), globalState);
    expect(nextState.focused).toEqual(['someOtherContextPath']);
});

test(`The "invalidate" action should remove the given node from toggled state`, () => {
    const state = {
        loading: [],
        errors: [],
        toggled: ['someContextPath', 'someOtherContextPath']
    };
    const nextState1 = reducer(state, actions.invalidate('someContextPath'));
    const nextState2 = reducer(state, actions.invalidate('someOtherContextPath'));
    const nextState3 = reducer(nextState1, actions.invalidate('someOtherContextPath'));

    expect(nextState1.toggled).toEqual(['someOtherContextPath']);
    expect(nextState2.toggled).toEqual(['someContextPath']);
    expect(nextState3.toggled).toEqual([]);
});

test(`The "invalidate" action should remove the given node from loading state`, () => {
    const state = {
        toggled: [],
        errors: [],
        loading: ['someContextPath', 'someOtherContextPath']
    };
    const nextState1 = reducer(state, actions.invalidate('someContextPath'));
    const nextState2 = reducer(state, actions.invalidate('someOtherContextPath'));
    const nextState3 = reducer(nextState1, actions.invalidate('someOtherContextPath'));

    expect(nextState1.loading).toEqual(['someOtherContextPath']);
    expect(nextState2.loading).toEqual(['someContextPath']);
    expect(nextState3.loading).toEqual([]);
});

test(`The "invalidate" action should add the given node to error state`, () => {
    const state = {
        toggled: [],
        loading: [],
        errors: []
    };
    const nextState1 = reducer(state, actions.invalidate('someContextPath'));
    const nextState2 = reducer(state, actions.invalidate('someOtherContextPath'));
    const nextState3 = reducer(nextState1, actions.invalidate('someOtherContextPath'));

    expect(nextState1.errors).toEqual(['someContextPath']);
    expect(nextState2.errors).toEqual(['someOtherContextPath']);
    expect(nextState3.errors).toEqual(['someContextPath', 'someOtherContextPath']);
});

test(`The "setAsLoading" action should remove the given node from error state`, () => {
    const state = {
        toggled: [],
        loading: [],
        errors: ['someContextPath', 'someOtherContextPath']
    };
    const nextState1 = reducer(state, actions.setAsLoading('someContextPath'));
    const nextState2 = reducer(state, actions.setAsLoading('someOtherContextPath'));
    const nextState3 = reducer(nextState1, actions.setAsLoading('someOtherContextPath'));

    expect(nextState1.errors).toEqual(['someOtherContextPath']);
    expect(nextState2.errors).toEqual(['someContextPath']);
    expect(nextState3.errors).toEqual([]);
});

test(`The "setAsLoading" action should add the given node to loading state`, () => {
    const state = {
        toggled: [],
        errors: [],
        loading: []
    };
    const nextState1 = reducer(state, actions.setAsLoading('someContextPath'));
    const nextState2 = reducer(state, actions.setAsLoading('someOtherContextPath'));
    const nextState3 = reducer(nextState1, actions.setAsLoading('someOtherContextPath'));

    expect(nextState1.loading).toEqual(['someContextPath']);
    expect(nextState2.loading).toEqual(['someOtherContextPath']);
    expect(nextState3.loading).toEqual(['someContextPath', 'someOtherContextPath']);
});

test(`The "setAsLoaded" action should remove the given node to loading state`, () => {
    const state = {
        toggled: [],
        errors: [],
        loading: ['someContextPath', 'someOtherContextPath']
    };
    const nextState1 = reducer(state, actions.setAsLoaded('someContextPath'));
    const nextState2 = reducer(state, actions.setAsLoaded('someOtherContextPath'));
    const nextState3 = reducer(nextState1, actions.setAsLoaded('someOtherContextPath'));

    expect(nextState1.loading).toEqual(['someOtherContextPath']);
    expect(nextState2.loading).toEqual(['someContextPath']);
    expect(nextState3.loading).toEqual([]);
});
