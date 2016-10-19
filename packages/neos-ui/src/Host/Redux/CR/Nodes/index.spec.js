import test from 'ava';
import Immutable, {Map} from 'immutable';

import {actionTypes, reducer, actions, selectors} from './index';

import {actionTypes as system} from 'Host/Redux/System/index';

test(`Host > Redux > CR > Nodes: should export actionTypes`, t => {
    t.not(actionTypes, undefined);
    t.not(actionTypes.ADD, undefined);
    t.not(actionTypes.FOCUS, undefined);
    t.not(actionTypes.UNFOCUS, undefined);
    t.not(actionTypes.BLUR, undefined);
    t.not(actionTypes.HOVER, undefined);
    t.not(actionTypes.UNHOVER, undefined);
});

test(`Host > Redux > CR > Nodes: should export action creators`, t => {
    t.not(actions, undefined);
    t.is(typeof (actions.add), 'function');
    t.is(typeof (actions.focus), 'function');
    t.is(typeof (actions.unFocus), 'function');
    t.is(typeof (actions.blur), 'function');
    t.is(typeof (actions.hover), 'function');
    t.is(typeof (actions.unhover), 'function');
});

test(`Host > Redux > CR > Nodes: should export a reducer`, t => {
    t.not(reducer, undefined);
    t.is(typeof (reducer), 'function');
});

test(`Host > Redux > CR > Nodes: should export selectors`, t => {
    t.not(selectors, undefined);
});

test(`Host > Redux > CR > Nodes: The reducer should create a valid initial state`, t => {
    const state = new Map({});
    const nextState = reducer(state, {
        type: system.INIT
    });

    t.true(nextState.get('cr').get('nodes') instanceof Map);
    t.true(nextState.get('cr').get('nodes').get('byContextPath') instanceof Map);
    t.is(typeof (nextState.get('cr').get('nodes').get('siteNode')), 'string');
    t.true(nextState.get('cr').get('nodes').get('focused') instanceof Map);
    t.is(typeof (nextState.get('cr').get('nodes').get('focused').get('contextPath')), 'string');
    t.is(typeof (nextState.get('cr').get('nodes').get('focused').get('typoscriptPath')), 'string');
    t.true(nextState.get('cr').get('nodes').get('hovered') instanceof Map);
    t.is(typeof (nextState.get('cr').get('nodes').get('hovered').get('contextPath')), 'string');
    t.is(typeof (nextState.get('cr').get('nodes').get('hovered').get('typoscriptPath')), 'string');
});

test(`
    Host > Redux > CR > Nodes: The reducer should take initially existing nodes
    into account`, t => {
    const state = Immutable.fromJS({
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
        type: system.INIT
    });

    t.true(nextState.get('cr').get('nodes').get('byContextPath') instanceof Map);
    t.not(nextState.get('cr').get('nodes').get('byContextPath').get('someContextPath'), undefined);
    t.deepEqual(nextState.get('cr').get('nodes').get('byContextPath').toJS(), {
        someContextPath: {
            some: 'property'
        }
    });
});

test(`
    Host > Redux > CR > Nodes: The reducer should take an initially configured siteNode
    into account`, t => {
    const state = Immutable.fromJS({
        cr: {
            nodes: {
                siteNode: 'theSiteNode'
            }
        }
    });
    const nextState = reducer(state, {
        type: system.INIT
    });

    t.is(nextState.get('cr').get('nodes').get('siteNode'), 'theSiteNode');
});

test(`Host > Redux > CR > Nodes: The reducer should add nodes to the store`, t => {
    const state = Immutable.fromJS({
        cr: {
            nodes: {
                byContextPath: {}
            }
        }
    });
    const contextPath = '/path/top/my/node@user-username;language=en_US';
    const nextState = reducer(state, actions.add(contextPath, {
        foo: 'bar'
    }));

    const addedItem = nextState.get('cr').get('nodes').get('byContextPath').get(contextPath);

    t.not(addedItem, undefined);
    t.true(addedItem instanceof Map);
    t.deepEqual(addedItem.toJS(), {
        foo: 'bar'
    });
});
