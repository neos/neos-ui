import test from 'ava';
import Immutable, {Map} from 'immutable';

import {actionTypes, actions, reducer} from './index.js';

import {actionTypes as system} from '../../System/index';

test(`should export actionTypes`, t => {
    t.not(actionTypes, undefined);
    t.is(typeof (actionTypes.FOCUS), 'string');
    t.is(typeof (actionTypes.COMMENCE_UNCOLLAPSE), 'string');
    t.is(typeof (actionTypes.UNCOLLAPSE), 'string');
    t.is(typeof (actionTypes.COLLAPSE), 'string');
    t.is(typeof (actionTypes.TOGGLE), 'string');
    t.is(typeof (actionTypes.INVALIDATE), 'string');
    t.is(typeof (actionTypes.REQUEST_CHILDREN), 'string');
});

test(`should export action creators`, t => {
    t.not(actions, undefined);
    t.is(typeof (actions.focus), 'function');
    t.is(typeof (actions.commenceUncollapse), 'function');
    t.is(typeof (actions.uncollapse), 'function');
    t.is(typeof (actions.collapse), 'function');
    t.is(typeof (actions.toggle), 'function');
    t.is(typeof (actions.invalidate), 'function');
    t.is(typeof (actions.requestChildren), 'function');
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

    t.true(nextState.get('ui').get('pageTree') instanceof Map);
});

test(`The "focus" action should set the focused node context path.`, t => {
    const state = Immutable.fromJS({
        ui: {
            pageTree: {
                isFocused: 'someContextPath'
            }
        }
    });
    const nextState = reducer(state, actions.focus('someOtherContextPath'));

    t.not(nextState.get('ui').get('pageTree').get('isFocused'), 'someContextPath');
    t.is(nextState.get('ui').get('pageTree').get('isFocused'), 'someOtherContextPath');
});

test(`The "uncollapse" action should remove the given node from error state`, t => {
    const state = Immutable.fromJS({
        ui: {
            pageTree: {
                uncollapsed: [],
                loading: [],
                errors: ['someContextPath', 'someOtherContextPath']
            }
        }
    });
    const nextState1 = reducer(state, actions.uncollapse('someContextPath'));
    const nextState2 = reducer(state, actions.uncollapse('someOtherContextPath'));
    const nextState3 = reducer(nextState1, actions.uncollapse('someOtherContextPath'));

    t.deepEqual(nextState1.get('ui').get('pageTree').get('errors').toJS(), ['someOtherContextPath']);
    t.deepEqual(nextState2.get('ui').get('pageTree').get('errors').toJS(), ['someContextPath']);
    t.deepEqual(nextState3.get('ui').get('pageTree').get('errors').toJS(), []);
});

test(`The "uncollapse" action should remove the given node from loading state`, t => {
    const state = Immutable.fromJS({
        ui: {
            pageTree: {
                uncollapsed: [],
                errors: [],
                loading: ['someContextPath', 'someOtherContextPath']
            }
        }
    });
    const nextState1 = reducer(state, actions.uncollapse('someContextPath'));
    const nextState2 = reducer(state, actions.uncollapse('someOtherContextPath'));
    const nextState3 = reducer(nextState1, actions.uncollapse('someOtherContextPath'));

    t.deepEqual(nextState1.get('ui').get('pageTree').get('loading').toJS(), ['someOtherContextPath']);
    t.deepEqual(nextState2.get('ui').get('pageTree').get('loading').toJS(), ['someContextPath']);
    t.deepEqual(nextState3.get('ui').get('pageTree').get('loading').toJS(), []);
});

test(`The "uncollapse" action should add the given node to uncollapsed state`, t => {
    const state = Immutable.fromJS({
        ui: {
            pageTree: {
                loading: [],
                errors: [],
                uncollapsed: []
            }
        }
    });
    const nextState1 = reducer(state, actions.uncollapse('someContextPath'));
    const nextState2 = reducer(state, actions.uncollapse('someOtherContextPath'));
    const nextState3 = reducer(nextState1, actions.uncollapse('someOtherContextPath'));

    t.deepEqual(nextState1.get('ui').get('pageTree').get('uncollapsed').toJS(), ['someContextPath']);
    t.deepEqual(nextState2.get('ui').get('pageTree').get('uncollapsed').toJS(), ['someOtherContextPath']);
    t.deepEqual(nextState3.get('ui').get('pageTree').get('uncollapsed').toJS(), ['someContextPath', 'someOtherContextPath']);
});

test(`The "collapse" action should remove the given node from error state`, t => {
    const state = Immutable.fromJS({
        ui: {
            pageTree: {
                uncollapsed: [],
                loading: [],
                errors: ['someContextPath', 'someOtherContextPath']
            }
        }
    });
    const nextState1 = reducer(state, actions.collapse('someContextPath'));
    const nextState2 = reducer(state, actions.collapse('someOtherContextPath'));
    const nextState3 = reducer(nextState1, actions.collapse('someOtherContextPath'));

    t.deepEqual(nextState1.get('ui').get('pageTree').get('errors').toJS(), ['someOtherContextPath']);
    t.deepEqual(nextState2.get('ui').get('pageTree').get('errors').toJS(), ['someContextPath']);
    t.deepEqual(nextState3.get('ui').get('pageTree').get('errors').toJS(), []);
});

test(`The "collapse" action should remove the given node from loading state`, t => {
    const state = Immutable.fromJS({
        ui: {
            pageTree: {
                uncollapsed: [],
                errors: [],
                loading: ['someContextPath', 'someOtherContextPath']
            }
        }
    });
    const nextState1 = reducer(state, actions.collapse('someContextPath'));
    const nextState2 = reducer(state, actions.collapse('someOtherContextPath'));
    const nextState3 = reducer(nextState1, actions.collapse('someOtherContextPath'));

    t.deepEqual(nextState1.get('ui').get('pageTree').get('loading').toJS(), ['someOtherContextPath']);
    t.deepEqual(nextState2.get('ui').get('pageTree').get('loading').toJS(), ['someContextPath']);
    t.deepEqual(nextState3.get('ui').get('pageTree').get('loading').toJS(), []);
});

test(`The "collapse" action should remove the given node from uncollapsed state`, t => {
    const state = Immutable.fromJS({
        ui: {
            pageTree: {
                loading: [],
                errors: [],
                uncollapsed: ['someContextPath', 'someOtherContextPath']
            }
        }
    });
    const nextState1 = reducer(state, actions.collapse('someContextPath'));
    const nextState2 = reducer(state, actions.collapse('someOtherContextPath'));
    const nextState3 = reducer(nextState1, actions.collapse('someOtherContextPath'));

    t.deepEqual(nextState1.get('ui').get('pageTree').get('uncollapsed').toJS(), ['someOtherContextPath']);
    t.deepEqual(nextState2.get('ui').get('pageTree').get('uncollapsed').toJS(), ['someContextPath']);
    t.deepEqual(nextState3.get('ui').get('pageTree').get('uncollapsed').toJS(), []);
});

test(`The "invalidate" action should remove the given node from uncollapsed state`, t => {
    const state = Immutable.fromJS({
        ui: {
            pageTree: {
                loading: [],
                errors: [],
                uncollapsed: ['someContextPath', 'someOtherContextPath']
            }
        }
    });
    const nextState1 = reducer(state, actions.invalidate('someContextPath'));
    const nextState2 = reducer(state, actions.invalidate('someOtherContextPath'));
    const nextState3 = reducer(nextState1, actions.invalidate('someOtherContextPath'));

    t.deepEqual(nextState1.get('ui').get('pageTree').get('uncollapsed').toJS(), ['someOtherContextPath']);
    t.deepEqual(nextState2.get('ui').get('pageTree').get('uncollapsed').toJS(), ['someContextPath']);
    t.deepEqual(nextState3.get('ui').get('pageTree').get('uncollapsed').toJS(), []);
});

test(`The "invalidate" action should remove the given node from loading state`, t => {
    const state = Immutable.fromJS({
        ui: {
            pageTree: {
                uncollapsed: [],
                errors: [],
                loading: ['someContextPath', 'someOtherContextPath']
            }
        }
    });
    const nextState1 = reducer(state, actions.invalidate('someContextPath'));
    const nextState2 = reducer(state, actions.invalidate('someOtherContextPath'));
    const nextState3 = reducer(nextState1, actions.invalidate('someOtherContextPath'));

    t.deepEqual(nextState1.get('ui').get('pageTree').get('loading').toJS(), ['someOtherContextPath']);
    t.deepEqual(nextState2.get('ui').get('pageTree').get('loading').toJS(), ['someContextPath']);
    t.deepEqual(nextState3.get('ui').get('pageTree').get('loading').toJS(), []);
});

test(`The "invalidate" action should add the given node to error state`, t => {
    const state = Immutable.fromJS({
        ui: {
            pageTree: {
                uncollapsed: [],
                loading: [],
                errors: []
            }
        }
    });
    const nextState1 = reducer(state, actions.invalidate('someContextPath'));
    const nextState2 = reducer(state, actions.invalidate('someOtherContextPath'));
    const nextState3 = reducer(nextState1, actions.invalidate('someOtherContextPath'));

    t.deepEqual(nextState1.get('ui').get('pageTree').get('errors').toJS(), ['someContextPath']);
    t.deepEqual(nextState2.get('ui').get('pageTree').get('errors').toJS(), ['someOtherContextPath']);
    t.deepEqual(nextState3.get('ui').get('pageTree').get('errors').toJS(), ['someContextPath', 'someOtherContextPath']);
});

test(`The "setAsLoading" action should remove the given node from error state`, t => {
    const state = Immutable.fromJS({
        ui: {
            pageTree: {
                uncollapsed: [],
                loading: [],
                errors: ['someContextPath', 'someOtherContextPath']
            }
        }
    });
    const nextState1 = reducer(state, actions.setAsLoading('someContextPath'));
    const nextState2 = reducer(state, actions.setAsLoading('someOtherContextPath'));
    const nextState3 = reducer(nextState1, actions.setAsLoading('someOtherContextPath'));

    t.deepEqual(nextState1.get('ui').get('pageTree').get('errors').toJS(), ['someOtherContextPath']);
    t.deepEqual(nextState2.get('ui').get('pageTree').get('errors').toJS(), ['someContextPath']);
    t.deepEqual(nextState3.get('ui').get('pageTree').get('errors').toJS(), []);
});

test(`The "setAsLoading" action should add the given node to loading state`, t => {
    const state = Immutable.fromJS({
        ui: {
            pageTree: {
                uncollapsed: [],
                errors: [],
                loading: []
            }
        }
    });
    const nextState1 = reducer(state, actions.setAsLoading('someContextPath'));
    const nextState2 = reducer(state, actions.setAsLoading('someOtherContextPath'));
    const nextState3 = reducer(nextState1, actions.setAsLoading('someOtherContextPath'));

    t.deepEqual(nextState1.get('ui').get('pageTree').get('loading').toJS(), ['someContextPath']);
    t.deepEqual(nextState2.get('ui').get('pageTree').get('loading').toJS(), ['someOtherContextPath']);
    t.deepEqual(nextState3.get('ui').get('pageTree').get('loading').toJS(), ['someContextPath', 'someOtherContextPath']);
});

test(`The "setAsLoaded" action should remove the given node to loading state`, t => {
    const state = Immutable.fromJS({
        ui: {
            pageTree: {
                uncollapsed: [],
                errors: [],
                loading: ['someContextPath', 'someOtherContextPath']
            }
        }
    });
    const nextState1 = reducer(state, actions.setAsLoaded('someContextPath'));
    const nextState2 = reducer(state, actions.setAsLoaded('someOtherContextPath'));
    const nextState3 = reducer(nextState1, actions.setAsLoaded('someOtherContextPath'));

    t.deepEqual(nextState1.get('ui').get('pageTree').get('loading').toJS(), ['someOtherContextPath']);
    t.deepEqual(nextState2.get('ui').get('pageTree').get('loading').toJS(), ['someContextPath']);
    t.deepEqual(nextState3.get('ui').get('pageTree').get('loading').toJS(), []);
});
