import Immutable, {Map} from 'immutable';

import {actionTypes, actions, reducer} from './index.js';

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

test(`The reducer should return an Immutable.Map as the initial state.`, () => {
    const state = new Map({});
    const nextState = reducer(state, {
        type: system.INIT
    });

    expect(nextState.get('ui').get('pageTree') instanceof Map).toBe(true);
});

test(`The "focus" action should set the focused node context path.`, () => {
    const state = Immutable.fromJS({
        ui: {
            pageTree: {
                isFocused: 'someContextPath'
            }
        }
    });
    const nextState = reducer(state, actions.focus('someOtherContextPath'));

    expect(nextState.get('ui').get('pageTree').get('isFocused')).not.toBe('someContextPath');
    expect(nextState.get('ui').get('pageTree').get('isFocused')).toBe('someOtherContextPath');
});

test(`The "invalidate" action should remove the given node from toggled state`, () => {
    const state = Immutable.fromJS({
        ui: {
            pageTree: {
                loading: [],
                errors: [],
                toggled: ['someContextPath', 'someOtherContextPath']
            }
        }
    });
    const nextState1 = reducer(state, actions.invalidate('someContextPath'));
    const nextState2 = reducer(state, actions.invalidate('someOtherContextPath'));
    const nextState3 = reducer(nextState1, actions.invalidate('someOtherContextPath'));

    expect(nextState1.get('ui').get('pageTree').get('toggled').toJS()).toEqual(['someOtherContextPath']);
    expect(nextState2.get('ui').get('pageTree').get('toggled').toJS()).toEqual(['someContextPath']);
    expect(nextState3.get('ui').get('pageTree').get('toggled').toJS()).toEqual([]);
});

test(`The "invalidate" action should remove the given node from loading state`, () => {
    const state = Immutable.fromJS({
        ui: {
            pageTree: {
                toggled: [],
                errors: [],
                loading: ['someContextPath', 'someOtherContextPath']
            }
        }
    });
    const nextState1 = reducer(state, actions.invalidate('someContextPath'));
    const nextState2 = reducer(state, actions.invalidate('someOtherContextPath'));
    const nextState3 = reducer(nextState1, actions.invalidate('someOtherContextPath'));

    expect(nextState1.get('ui').get('pageTree').get('loading').toJS()).toEqual(['someOtherContextPath']);
    expect(nextState2.get('ui').get('pageTree').get('loading').toJS()).toEqual(['someContextPath']);
    expect(nextState3.get('ui').get('pageTree').get('loading').toJS()).toEqual([]);
});

test(`The "invalidate" action should add the given node to error state`, () => {
    const state = Immutable.fromJS({
        ui: {
            pageTree: {
                toggled: [],
                loading: [],
                errors: []
            }
        }
    });
    const nextState1 = reducer(state, actions.invalidate('someContextPath'));
    const nextState2 = reducer(state, actions.invalidate('someOtherContextPath'));
    const nextState3 = reducer(nextState1, actions.invalidate('someOtherContextPath'));

    expect(nextState1.get('ui').get('pageTree').get('errors').toJS()).toEqual(['someContextPath']);
    expect(nextState2.get('ui').get('pageTree').get('errors').toJS()).toEqual(['someOtherContextPath']);
    expect(nextState3.get('ui').get('pageTree').get('errors').toJS()).toEqual(['someContextPath', 'someOtherContextPath']);
});

test(`The "setAsLoading" action should remove the given node from error state`, () => {
    const state = Immutable.fromJS({
        ui: {
            pageTree: {
                toggled: [],
                loading: [],
                errors: ['someContextPath', 'someOtherContextPath']
            }
        }
    });
    const nextState1 = reducer(state, actions.setAsLoading('someContextPath'));
    const nextState2 = reducer(state, actions.setAsLoading('someOtherContextPath'));
    const nextState3 = reducer(nextState1, actions.setAsLoading('someOtherContextPath'));

    expect(nextState1.get('ui').get('pageTree').get('errors').toJS()).toEqual(['someOtherContextPath']);
    expect(nextState2.get('ui').get('pageTree').get('errors').toJS()).toEqual(['someContextPath']);
    expect(nextState3.get('ui').get('pageTree').get('errors').toJS()).toEqual([]);
});

test(`The "setAsLoading" action should add the given node to loading state`, () => {
    const state = Immutable.fromJS({
        ui: {
            pageTree: {
                toggled: [],
                errors: [],
                loading: []
            }
        }
    });
    const nextState1 = reducer(state, actions.setAsLoading('someContextPath'));
    const nextState2 = reducer(state, actions.setAsLoading('someOtherContextPath'));
    const nextState3 = reducer(nextState1, actions.setAsLoading('someOtherContextPath'));

    expect(nextState1.get('ui').get('pageTree').get('loading').toJS()).toEqual(['someContextPath']);
    expect(nextState2.get('ui').get('pageTree').get('loading').toJS()).toEqual(['someOtherContextPath']);
    expect(nextState3.get('ui').get('pageTree').get('loading').toJS()).toEqual(['someContextPath', 'someOtherContextPath']);
});

test(`The "setAsLoaded" action should remove the given node to loading state`, () => {
    const state = Immutable.fromJS({
        ui: {
            pageTree: {
                toggled: [],
                errors: [],
                loading: ['someContextPath', 'someOtherContextPath']
            }
        }
    });
    const nextState1 = reducer(state, actions.setAsLoaded('someContextPath'));
    const nextState2 = reducer(state, actions.setAsLoaded('someOtherContextPath'));
    const nextState3 = reducer(nextState1, actions.setAsLoaded('someOtherContextPath'));

    expect(nextState1.get('ui').get('pageTree').get('loading').toJS()).toEqual(['someOtherContextPath']);
    expect(nextState2.get('ui').get('pageTree').get('loading').toJS()).toEqual(['someContextPath']);
    expect(nextState3.get('ui').get('pageTree').get('loading').toJS()).toEqual([]);
});
