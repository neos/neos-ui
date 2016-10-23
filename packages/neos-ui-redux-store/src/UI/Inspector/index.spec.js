import test from 'ava';
import Immutable, {Map} from 'immutable';

import {actionTypes, actions, reducer, selectors} from './index.js';

import {actionTypes as system} from '../../System/index';

test(`should export actionTypes`, t => {
    t.not(actionTypes, undefined);
    t.is(typeof (actionTypes.COMMIT), 'string');
    t.is(typeof (actionTypes.CLEAR), 'string');
    t.is(typeof (actionTypes.APPLY), 'string');
    t.is(typeof (actionTypes.DISCARD), 'string');
});

test(`should export action creators`, t => {
    t.not(actions, undefined);
    t.is(typeof (actions.commit), 'function');
    t.is(typeof (actions.clear), 'function');
    t.is(typeof (actions.apply), 'function');
    t.is(typeof (actions.discard), 'function');
});

test(`should export a reducer`, t => {
    t.not(reducer, undefined);
    t.is(typeof (reducer), 'function');
});

test(`should export selectors`, t => {
    t.not(selectors, undefined);
    t.is(typeof (selectors.transientValues), 'function');
    t.is(typeof (selectors.viewConfiguration), 'function');
});

test(`The reducer should return an Immutable.Map as the initial state.`, t => {
    const state = new Map({});
    const nextState = reducer(state, {
        type: system.INIT
    });

    t.true(nextState.get('ui').get('inspector') instanceof Map);
    t.true(nextState.get('ui').get('inspector').get('valuesByNodePath') instanceof Map);
});

test(`The "commit" action should store the last modification on the currently focused node.`, t => {
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

    t.deepEqual(nextState1.get('ui').get('inspector').get('valuesByNodePath').toJS(), {
        '/my/path@user-foo': {
            test: {
                value: 'value'
            }
        }
    });
    t.deepEqual(nextState2.get('ui').get('inspector').get('valuesByNodePath').toJS(), {
        '/my/path@user-foo': {
            test: {
                value: 'another value'
            }
        }
    });
    t.deepEqual(nextState3.get('ui').get('inspector').get('valuesByNodePath').toJS(), {
        '/my/path@user-foo': {
            test: {
                value: 'another value'
            }
        }
    });
    t.deepEqual(nextState4.get('ui').get('inspector').get('valuesByNodePath').toJS(), {
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

test(`The "clear" action should remove pending changes for the currently focused node.`, t => {
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

    t.deepEqual(nextState1.get('ui').get('inspector').get('valuesByNodePath').toJS(), {
        '/my/other/path@user-foo': {
            test4: {
                value: 'value4'
            }
        }
    });
    t.deepEqual(nextState2.get('ui').get('inspector').get('valuesByNodePath').toJS(), {
        '/my/other/path@user-foo': {
            test4: {
                value: 'value4'
            }
        }
    });
});

test(`The "discard" action should remove pending changes for the currently focused node.`, t => {
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

    t.deepEqual(nextState1.get('ui').get('inspector').get('valuesByNodePath').toJS(), {
        '/my/other/path@user-foo': {
            test4: {
                value: 'value4'
            }
        }
    });
    t.deepEqual(nextState2.get('ui').get('inspector').get('valuesByNodePath').toJS(), {
        '/my/other/path@user-foo': {
            test4: {
                value: 'value4'
            }
        }
    });
});
