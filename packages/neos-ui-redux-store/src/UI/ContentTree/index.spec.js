import Immutable, {Map} from 'immutable';

import {actionTypes, actions, reducer} from './index.js';

import {actionTypes as system} from '../../System/index';

test(`should export actionTypes`, () => {
    expect(actionTypes).not.toBe(undefined);
    expect(typeof (actionTypes.UNCOLLAPSE)).toBe('string');
    expect(typeof (actionTypes.COLLAPSE)).toBe('string');
    expect(typeof (actionTypes.TOGGLE)).toBe('string');
    expect(typeof (actionTypes.RELOAD_TREE)).toBe('string');
});

test(`should export action creators`, () => {
    expect(actions).not.toBe(undefined);
    expect(typeof (actions.uncollapse)).toBe('function');
    expect(typeof (actions.collapse)).toBe('function');
    expect(typeof (actions.toggle)).toBe('function');
    expect(typeof (actions.reloadTree)).toBe('function');
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

    expect(nextState.get('ui').get('contentTree') instanceof Map).toBe(true);
});

test(`The "uncollapse" action should add the given node to uncollapsed state`, () => {
    const state = Immutable.fromJS({
        ui: {
            contentTree: {
                uncollapsed: []
            }
        }
    });
    const nextState1 = reducer(state, actions.uncollapse('someContextPath'));
    const nextState2 = reducer(state, actions.uncollapse('someOtherContextPath'));
    const nextState3 = reducer(nextState1, actions.uncollapse('someOtherContextPath'));

    expect(nextState1.get('ui').get('contentTree').get('uncollapsed').toJS()).toEqual(['someContextPath']);
    expect(nextState2.get('ui').get('contentTree').get('uncollapsed').toJS()).toEqual(['someOtherContextPath']);
    expect(nextState3.get('ui').get('contentTree').get('uncollapsed').toJS()).toEqual(['someContextPath', 'someOtherContextPath']);
});

test(`The "collapse" action should remove the given node from uncollapsed state`, () => {
    const state = Immutable.fromJS({
        ui: {
            contentTree: {
                loading: [],
                errors: [],
                uncollapsed: ['someContextPath', 'someOtherContextPath']
            }
        }
    });
    const nextState1 = reducer(state, actions.collapse('someContextPath'));
    const nextState2 = reducer(state, actions.collapse('someOtherContextPath'));
    const nextState3 = reducer(nextState1, actions.collapse('someOtherContextPath'));

    expect(nextState1.get('ui').get('contentTree').get('uncollapsed').toJS()).toEqual(['someOtherContextPath']);
    expect(nextState2.get('ui').get('contentTree').get('uncollapsed').toJS()).toEqual(['someContextPath']);
    expect(nextState3.get('ui').get('contentTree').get('uncollapsed').toJS()).toEqual([]);
});
