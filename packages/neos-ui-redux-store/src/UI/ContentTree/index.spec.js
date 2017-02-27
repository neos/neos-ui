import test from 'ava';
import Immutable, {Map} from 'immutable';

import {actionTypes, actions, reducer} from './index.js';

import {actionTypes as system} from '../../System/index';

test(`should export actionTypes`, t => {
    t.not(actionTypes, undefined);
    t.is(typeof (actionTypes.UNCOLLAPSE), 'string');
    t.is(typeof (actionTypes.COLLAPSE), 'string');
    t.is(typeof (actionTypes.TOGGLE), 'string');
    t.is(typeof (actionTypes.RELOAD_TREE), 'string');
});

test(`should export action creators`, t => {
    t.not(actions, undefined);
    t.is(typeof (actions.uncollapse), 'function');
    t.is(typeof (actions.collapse), 'function');
    t.is(typeof (actions.toggle), 'function');
    t.is(typeof (actions.reloadTree), 'function');
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

    t.true(nextState.get('ui').get('contentTree') instanceof Map);
});

test(`The "uncollapse" action should add the given node to uncollapsed state`, t => {
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

    t.deepEqual(nextState1.get('ui').get('contentTree').get('uncollapsed').toJS(), ['someContextPath']);
    t.deepEqual(nextState2.get('ui').get('contentTree').get('uncollapsed').toJS(), ['someOtherContextPath']);
    t.deepEqual(nextState3.get('ui').get('contentTree').get('uncollapsed').toJS(), ['someContextPath', 'someOtherContextPath']);
});

test(`The "collapse" action should remove the given node from uncollapsed state`, t => {
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

    t.deepEqual(nextState1.get('ui').get('contentTree').get('uncollapsed').toJS(), ['someOtherContextPath']);
    t.deepEqual(nextState2.get('ui').get('contentTree').get('uncollapsed').toJS(), ['someContextPath']);
    t.deepEqual(nextState3.get('ui').get('contentTree').get('uncollapsed').toJS(), []);
});
