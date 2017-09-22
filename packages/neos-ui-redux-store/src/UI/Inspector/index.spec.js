import Immutable, {Map} from 'immutable';

import {actionTypes, actions, reducer, selectors} from './index.js';

import {actionTypes as system} from '../../System/index';

test(`should export actionTypes`, () => {
    expect(actionTypes).not.toBe(undefined);
    expect(typeof (actionTypes.COMMIT)).toBe('string');
    expect(typeof (actionTypes.CLEAR)).toBe('string');
    expect(typeof (actionTypes.APPLY)).toBe('string');
    expect(typeof (actionTypes.DISCARD)).toBe('string');
});

test(`should export action creators`, () => {
    expect(actions).not.toBe(undefined);
    expect(typeof (actions.commit)).toBe('function');
    expect(typeof (actions.clear)).toBe('function');
    expect(typeof (actions.apply)).toBe('function');
    expect(typeof (actions.discard)).toBe('function');
});

test(`should export a reducer`, () => {
    expect(reducer).not.toBe(undefined);
    expect(typeof (reducer)).toBe('function');
});

test(`should export selectors`, () => {
    expect(selectors).not.toBe(undefined);
    expect(typeof (selectors.transientValues)).toBe('function');
    expect(typeof (selectors.isDirty)).toBe('function');
    expect(typeof (selectors.viewConfiguration)).toBe('function');
});

test(`The reducer should return an Immutable.Map as the initial state.`, () => {
    const state = new Map({});
    const nextState = reducer(state, {
        type: system.INIT
    });

    expect(nextState.get('ui').get('inspector') instanceof Map).toBe(true);
    expect(
        nextState.get('ui').get('inspector').get('valuesByNodePath') instanceof Map
    ).toBe(true);
});

test(`The "commit" action should store the last modification on the currently focused node.`, () => {
    const state = Immutable.fromJS({
        cr: {
            nodes: {
                focused: {
                    contextPath: '/my/path@user-foo'
                }
            }
        },
        ui: {
            inspector: {
                valuesByNodePath: {}
            }
        }
    });
    const nextState1 = reducer(state, actions.commit('test', 'value'));
    const nextState2 = reducer(state, actions.commit('test', 'another value'));
    const nextState3 = reducer(nextState1, actions.commit('test', 'another value'));
    const nextState4 = reducer(nextState1, actions.commit('test', 'another value', {some: 'hook'}));

    expect(nextState1.get('ui').get('inspector').get('valuesByNodePath').toJS()).toEqual({
        '/my/path@user-foo': {
            test: {
                value: 'value'
            }
        }
    });
    expect(nextState2.get('ui').get('inspector').get('valuesByNodePath').toJS()).toEqual({
        '/my/path@user-foo': {
            test: {
                value: 'another value'
            }
        }
    });
    expect(nextState3.get('ui').get('inspector').get('valuesByNodePath').toJS()).toEqual({
        '/my/path@user-foo': {
            test: {
                value: 'another value'
            }
        }
    });
    expect(nextState4.get('ui').get('inspector').get('valuesByNodePath').toJS()).toEqual({
        '/my/path@user-foo': {
            test: {
                value: 'another value',
                hooks: {
                    some: 'hook'
                }
            }
        }
    });
});

test(`The "clear" action should remove pending changes for the currently focused node.`, () => {
    const state = Immutable.fromJS({
        cr: {
            nodes: {
                focused: {
                    contextPath: '/my/path@user-foo'
                }
            }
        },
        ui: {
            inspector: {
                valuesByNodePath: {
                    '/my/path@user-foo': {
                        test1: {
                            value: 'value1'
                        },
                        test2: {
                            value: 'value2'
                        },
                        test3: {
                            value: 'value3'
                        }
                    },
                    '/my/other/path@user-foo': {
                        test4: {
                            value: 'value4'
                        }
                    }
                }
            }
        }
    });
    const nextState1 = reducer(state, actions.clear());
    const nextState2 = reducer(nextState1, actions.clear());

    expect(nextState1.get('ui').get('inspector').get('valuesByNodePath').toJS()).toEqual({
        '/my/other/path@user-foo': {
            test4: {
                value: 'value4'
            }
        }
    });
    expect(nextState2.get('ui').get('inspector').get('valuesByNodePath').toJS()).toEqual({
        '/my/other/path@user-foo': {
            test4: {
                value: 'value4'
            }
        }
    });
});

test(`The "discard" action should remove pending changes for the currently focused node.`, () => {
    const state = Immutable.fromJS({
        cr: {
            nodes: {
                focused: {
                    contextPath: '/my/path@user-foo'
                }
            }
        },
        ui: {
            inspector: {
                valuesByNodePath: {
                    '/my/path@user-foo': {
                        test1: {
                            value: 'value1'
                        },
                        test2: {
                            value: 'value2'
                        },
                        test3: {
                            value: 'value3'
                        }
                    },
                    '/my/other/path@user-foo': {
                        test4: {
                            value: 'value4'
                        }
                    }
                }
            }
        }
    });
    const nextState1 = reducer(state, actions.discard());
    const nextState2 = reducer(nextState1, actions.discard());

    expect(nextState1.get('ui').get('inspector').get('valuesByNodePath').toJS()).toEqual({
        '/my/other/path@user-foo': {
            test4: {
                value: 'value4'
            }
        }
    });
    expect(nextState2.get('ui').get('inspector').get('valuesByNodePath').toJS()).toEqual({
        '/my/other/path@user-foo': {
            test4: {
                value: 'value4'
            }
        }
    });
});
