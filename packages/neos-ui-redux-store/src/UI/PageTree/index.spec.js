import Immutable, {Map} from 'immutable';

import {actionTypes, actions, reducer} from './index.js';

import {actionTypes as system} from '../../System/index';

test(`should export actionTypes`, () => {
    expect(actionTypes).not.toBe(undefined);
    expect(typeof (actionTypes.FOCUS)).toBe('string');
    expect(typeof (actionTypes.COMMENCE_UNCOLLAPSE)).toBe('string');
    expect(typeof (actionTypes.UNCOLLAPSE)).toBe('string');
    expect(typeof (actionTypes.COLLAPSE)).toBe('string');
    expect(typeof (actionTypes.TOGGLE)).toBe('string');
    expect(typeof (actionTypes.INVALIDATE)).toBe('string');
    expect(typeof (actionTypes.REQUEST_CHILDREN)).toBe('string');
});

test(`should export action creators`, () => {
    expect(actions).not.toBe(undefined);
    expect(typeof (actions.focus)).toBe('function');
    expect(typeof (actions.commenceUncollapse)).toBe('function');
    expect(typeof (actions.uncollapse)).toBe('function');
    expect(typeof (actions.collapse)).toBe('function');
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

test(`The "uncollapse" action should remove the given node from error state`, () => {
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

    expect(nextState1.get('ui').get('pageTree').get('errors').toJS()).toEqual(['someOtherContextPath']);
    expect(nextState2.get('ui').get('pageTree').get('errors').toJS()).toEqual(['someContextPath']);
    expect(nextState3.get('ui').get('pageTree').get('errors').toJS()).toEqual([]);
});

test(`The "uncollapse" action should remove the given node from loading state`, () => {
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

    expect(nextState1.get('ui').get('pageTree').get('loading').toJS()).toEqual(['someOtherContextPath']);
    expect(nextState2.get('ui').get('pageTree').get('loading').toJS()).toEqual(['someContextPath']);
    expect(nextState3.get('ui').get('pageTree').get('loading').toJS()).toEqual([]);
});

test(`The "uncollapse" action should add the given node to uncollapsed state`, () => {
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

    expect(nextState1.get('ui').get('pageTree').get('uncollapsed').toJS()).toEqual(['someContextPath']);
    expect(nextState2.get('ui').get('pageTree').get('uncollapsed').toJS()).toEqual(['someOtherContextPath']);
    expect(nextState3.get('ui').get('pageTree').get('uncollapsed').toJS()).toEqual(['someContextPath', 'someOtherContextPath']);
});

test(`The "collapse" action should remove the given node from error state`, () => {
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

    expect(nextState1.get('ui').get('pageTree').get('errors').toJS()).toEqual(['someOtherContextPath']);
    expect(nextState2.get('ui').get('pageTree').get('errors').toJS()).toEqual(['someContextPath']);
    expect(nextState3.get('ui').get('pageTree').get('errors').toJS()).toEqual([]);
});

test(`The "collapse" action should remove the given node from loading state`, () => {
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

    expect(nextState1.get('ui').get('pageTree').get('loading').toJS()).toEqual(['someOtherContextPath']);
    expect(nextState2.get('ui').get('pageTree').get('loading').toJS()).toEqual(['someContextPath']);
    expect(nextState3.get('ui').get('pageTree').get('loading').toJS()).toEqual([]);
});

test(`The "collapse" action should remove the given node from uncollapsed state`, () => {
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

    expect(nextState1.get('ui').get('pageTree').get('uncollapsed').toJS()).toEqual(['someOtherContextPath']);
    expect(nextState2.get('ui').get('pageTree').get('uncollapsed').toJS()).toEqual(['someContextPath']);
    expect(nextState3.get('ui').get('pageTree').get('uncollapsed').toJS()).toEqual([]);
});

test(`The "invalidate" action should remove the given node from uncollapsed state`, () => {
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

    expect(nextState1.get('ui').get('pageTree').get('uncollapsed').toJS()).toEqual(['someOtherContextPath']);
    expect(nextState2.get('ui').get('pageTree').get('uncollapsed').toJS()).toEqual(['someContextPath']);
    expect(nextState3.get('ui').get('pageTree').get('uncollapsed').toJS()).toEqual([]);
});

test(`The "invalidate" action should remove the given node from loading state`, () => {
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

    expect(nextState1.get('ui').get('pageTree').get('loading').toJS()).toEqual(['someOtherContextPath']);
    expect(nextState2.get('ui').get('pageTree').get('loading').toJS()).toEqual(['someContextPath']);
    expect(nextState3.get('ui').get('pageTree').get('loading').toJS()).toEqual([]);
});

test(`The "invalidate" action should add the given node to error state`, () => {
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

    expect(nextState1.get('ui').get('pageTree').get('errors').toJS()).toEqual(['someContextPath']);
    expect(nextState2.get('ui').get('pageTree').get('errors').toJS()).toEqual(['someOtherContextPath']);
    expect(nextState3.get('ui').get('pageTree').get('errors').toJS()).toEqual(['someContextPath', 'someOtherContextPath']);
});

test(`The "setAsLoading" action should remove the given node from error state`, () => {
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

    expect(nextState1.get('ui').get('pageTree').get('errors').toJS()).toEqual(['someOtherContextPath']);
    expect(nextState2.get('ui').get('pageTree').get('errors').toJS()).toEqual(['someContextPath']);
    expect(nextState3.get('ui').get('pageTree').get('errors').toJS()).toEqual([]);
});

test(`The "setAsLoading" action should add the given node to loading state`, () => {
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

    expect(nextState1.get('ui').get('pageTree').get('loading').toJS()).toEqual(['someContextPath']);
    expect(nextState2.get('ui').get('pageTree').get('loading').toJS()).toEqual(['someOtherContextPath']);
    expect(nextState3.get('ui').get('pageTree').get('loading').toJS()).toEqual(['someContextPath', 'someOtherContextPath']);
});

test(`The "setAsLoaded" action should remove the given node to loading state`, () => {
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

    expect(nextState1.get('ui').get('pageTree').get('loading').toJS()).toEqual(['someOtherContextPath']);
    expect(nextState2.get('ui').get('pageTree').get('loading').toJS()).toEqual(['someContextPath']);
    expect(nextState3.get('ui').get('pageTree').get('loading').toJS()).toEqual([]);
});
