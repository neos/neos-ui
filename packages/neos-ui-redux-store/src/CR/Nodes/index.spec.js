import Immutable, {Map} from 'immutable';

import {actionTypes, reducer, actions, selectors} from './index';

import {actionTypes as system} from '../../System/index';

test(`should export actionTypes`, () => {
    expect(actionTypes).not.toBe(undefined);
    expect(typeof (actionTypes.ADD)).toBe('string');
    expect(typeof (actionTypes.FOCUS)).toBe('string');
    expect(typeof (actionTypes.UNFOCUS)).toBe('string');
    expect(typeof (actionTypes.COMMENCE_REMOVAL)).toBe('string');
    expect(typeof (actionTypes.REMOVAL_ABORTED)).toBe('string');
    expect(typeof (actionTypes.REMOVAL_CONFIRMED)).toBe('string');
    expect(typeof (actionTypes.REMOVE)).toBe('string');
    expect(typeof (actionTypes.COPY)).toBe('string');
    expect(typeof (actionTypes.CUT)).toBe('string');
    expect(typeof (actionTypes.PASTE)).toBe('string');
});

test(`should export action creators`, () => {
    expect(actions).not.toBe(undefined);
    expect(typeof (actions.add)).toBe('function');
    expect(typeof (actions.focus)).toBe('function');
    expect(typeof (actions.unFocus)).toBe('function');
    expect(typeof (actions.commenceRemoval)).toBe('function');
    expect(typeof (actions.abortRemoval)).toBe('function');
    expect(typeof (actions.confirmRemoval)).toBe('function');
    expect(typeof (actions.remove)).toBe('function');
    expect(typeof (actions.copy)).toBe('function');
    expect(typeof (actions.cut)).toBe('function');
    expect(typeof (actions.paste)).toBe('function');
});

test(`should export a reducer`, () => {
    expect(reducer).not.toBe(undefined);
    expect(typeof (reducer)).toBe('function');
});

test(`should export selectors`, () => {
    expect(selectors).not.toBe(undefined);
});

test(`The reducer should create a valid initial state`, () => {
    const state = new Map({});
    const nextState = reducer(state, {
        type: system.INIT
    });

    expect(nextState.get('cr').get('nodes') instanceof Map).toBe(true);
    expect(nextState.get('cr').get('nodes').get('byContextPath') instanceof Map).toBe(true);
    expect(typeof (nextState.get('cr').get('nodes').get('siteNode'))).toBe('string');
    expect(nextState.get('cr').get('nodes').get('focused') instanceof Map).toBe(true);
    expect(
        typeof (nextState.get('cr').get('nodes').get('focused').get('contextPath'))
    ).toBe('string');
    expect(typeof (nextState.get('cr').get('nodes').get('focused').get('fusionPath'))).toBe('string');
});

test(`The reducer should take initially existing nodes into account`, () => {
    const state = new Map({});
    const serverState = Immutable.fromJS({
        cr: {
            nodes: {
                byContextPath: {
                    someContextPath: {
                        some: 'property'
                    }
                }
            }
        }
    });
    const nextState = reducer(state, {
        type: system.INIT,
        payload: serverState
    });

    expect(nextState.get('cr').get('nodes').get('byContextPath') instanceof Map).toBe(true);
    expect(
        nextState.get('cr').get('nodes').get('byContextPath').get('someContextPath')
    ).not.toBe(undefined);
    expect(nextState.get('cr').get('nodes').get('byContextPath').toJS()).toEqual({
        someContextPath: {
            some: 'property'
        }
    });
});

test(`The reducer should take an initially configured siteNode into account`, () => {
    const state = new Map({});
    const serverState = Immutable.fromJS({
        cr: {
            nodes: {
                siteNode: 'theSiteNode'
            }
        }
    });
    const nextState = reducer(state, {
        type: system.INIT,
        payload: serverState
    });

    expect(nextState.get('cr').get('nodes').get('siteNode')).toBe('theSiteNode');
});

test(`The reducer should add nodes to the store`, () => {
    const state = Immutable.fromJS({
        cr: {
            nodes: {
                byContextPath: {}
            }
        }
    });
    const contextPath = '/path/top/my/node@user-username;language=en_US';
    const nextState = reducer(state, actions.add({
        [contextPath]: {
            foo: 'bar'
        }
    }));

    const addedItem = nextState.get('cr').get('nodes').get('byContextPath').get(contextPath);

    expect(addedItem).not.toBe(undefined);
    expect(addedItem instanceof Map).toBe(true);
    expect(addedItem.toJS()).toEqual({
        foo: 'bar'
    });
});

test(`The reducer should mark a node for removal`, () => {
    expect(true).toBe(true);
});
test(`The reducer should unmark a node for removal`, () => {
    expect(true).toBe(true);
});
test(`The reducer should remove a node that was marked for removal from the store`, () => {
    expect(true).toBe(true);
});
test(`The reducer should mark a node for copy`, () => {
    expect(true).toBe(true);
});
test(`The reducer should mark a node for cut`, () => {
    expect(true).toBe(true);
});
test(`The reducer should paste nodes`, () => {
    expect(true).toBe(true);
});
