import {actionTypes, actions, reducer, selectors} from './index';

import {actionTypes as system} from '../../System/index';

const fixtures = {};

fixtures.focusedNodeStateWithEmptyInspector = {
    valuesByNodePath: {}
};

test(`should export actionTypes`, () => {
    expect(actionTypes).not.toBe(undefined);
    expect(typeof (actionTypes.COMMIT)).toBe('string');
    expect(typeof (actionTypes.CLEAR)).toBe('string');
    expect(typeof (actionTypes.APPLY)).toBe('string');
    expect(typeof (actionTypes.DISCARD)).toBe('string');
    expect(typeof (actionTypes.ESCAPE)).toBe('string');
    expect(typeof (actionTypes.RESUME)).toBe('string');
});

test(`should export action creators`, () => {
    expect(actions).not.toBe(undefined);
    expect(typeof (actions.commit)).toBe('function');
    expect(typeof (actions.clear)).toBe('function');
    expect(typeof (actions.apply)).toBe('function');
    expect(typeof (actions.discard)).toBe('function');
    expect(typeof (actions.escape)).toBe('function');
    expect(typeof (actions.resume)).toBe('function');
});

test(`should export a reducer`, () => {
    expect(reducer).not.toBe(undefined);
    expect(typeof (reducer)).toBe('function');
});

test(`should export selectors`, () => {
    expect(selectors).not.toBe(undefined);
    expect(typeof (selectors.transientValues)).toBe('function');
    expect(typeof (selectors.isDirty)).toBe('function');
    expect(typeof (selectors.shouldPromptToHandleUnappliedChanges)).toBe('function');
});

test(`The reducer should return a plain JS object as the initial state.`, () => {
    const nextState = reducer(undefined, {
        type: system.INIT,
        payload: {
            ui: {
                inspector: {}
            }
        }
    });

    expect(typeof nextState).toBe('object');
});

test(`The initial state should not be dirty`, () => {
    const nextState = reducer(undefined, {
        type: system.INIT,
        payload: {
            ui: {
                inspector: {}
            }
        }
    });

    expect(selectors.isDirty(nextState)).toBe(false);
});

test(`The initial state should not be forcing apply`, () => {
    const nextState = reducer(undefined, {
        type: system.INIT,
        payload: {
            ui: {
                inspector: {}
            }
        }
    });

    const fullState = {
        ui: {
            inspector: nextState
        }
    };

    expect(selectors.shouldPromptToHandleUnappliedChanges(fullState)).toBe(false);
});

test(`The "commit" action should store the last modification on the currently focused node.`, () => {
    const state = fixtures.focusedNodeStateWithEmptyInspector;
    const focusedNode = {
        contextPath: 'someContextPath',
        properties: {
            some: 'property'
        }
    };
    const nextState1 = reducer(state, actions.commit('test', 'value', undefined, focusedNode));
    const nextState2 = reducer(state, actions.commit('test', 'another value', undefined, focusedNode));
    const nextState3 = reducer(nextState1, actions.commit('test', 'another value', undefined, focusedNode));
    const nextState4 = reducer(nextState1, actions.commit('test', 'another value', {some: 'hook'}, focusedNode));

    expect(nextState1).toMatchSnapshot();
    expect(nextState2).toMatchSnapshot();
    expect(nextState3).toMatchSnapshot();
    expect(nextState4).toMatchSnapshot();
});

test(`The "commit" action should ignore the last modification, if it doesn't differ from the current node state`, () => {
    const state = fixtures.focusedNodeStateWithEmptyInspector;
    const focusedNode = {
        contextPath: 'someContextPath',
        properties: {
            some: 'property'
        }
    };
    const nextState = reducer(state, actions.commit('some', 'property', undefined, focusedNode));

    expect(nextState).toMatchSnapshot();
});

test(`The "clear" action should remove pending changes for the currently focused node.`, () => {
    const state = {
        valuesByNodePath: {
            someContextPath: {
                someProperty: 'value'
            },
            someOtherContextPath: {
                someProperty: 'value'
            }
        }
    };
    const focusedNodeContextPath = 'someContextPath';
    const nextState1 = reducer(state, actions.clear(focusedNodeContextPath));
    const nextState2 = reducer(nextState1, actions.clear(focusedNodeContextPath));

    expect(nextState1).toMatchSnapshot();
    expect(nextState2).toMatchSnapshot();
});

test(`The "clear" action should reset the shouldPromptToHandleUnappliedChanges state to false`, () => {
    const state = {
        shouldPromptToHandleUnappliedChanges: true,
        valuesByNodePath: {
            someContextPath: {}
        }
    };
    const focusedNodeContextPath = 'someContextPath';
    const nextState = reducer(state, actions.clear(focusedNodeContextPath));

    expect(nextState.shouldPromptToHandleUnappliedChanges).toBe(false);
});

test(`The "discard" action should remove pending changes for the currently focused node.`, () => {
    const state = {
        valuesByNodePath: {
            someContextPath: {
                someProperty: 'value'
            },
            someOtherContextPath: {
                someProperty: 'value'
            }
        }
    };
    const focusedNodeContextPath = 'someContextPath';
    const nextState1 = reducer(state, actions.discard(focusedNodeContextPath));
    const nextState2 = reducer(nextState1, actions.discard(focusedNodeContextPath));

    expect(nextState1).toMatchSnapshot();
    expect(nextState2).toMatchSnapshot();
});

test(`The "discard" action should reset the shouldPromptToHandleUnappliedChanges state to false`, () => {
    const state = {
        shouldPromptToHandleUnappliedChanges: true,
        valuesByNodePath: {
            someContextPath: {}
        }
    };
    const focusedNodeContextPath = 'someContextPath';
    const nextState = reducer(state, actions.discard(focusedNodeContextPath));

    expect(nextState.shouldPromptToHandleUnappliedChanges).toBe(false);
});

test(`The "escape" action should reset the shouldPromptToHandleUnappliedChanges state to true`, () => {
    const state = {
        shouldPromptToHandleUnappliedChanges: false
    };
    const nextState = reducer(state, actions.escape());

    expect(nextState.shouldPromptToHandleUnappliedChanges).toBe(true);
});

test(`The "resume" action should reset the shouldPromptToHandleUnappliedChanges state to false`, () => {
    const state = {
        shouldPromptToHandleUnappliedChanges: true
    };
    const nextState = reducer(state, actions.resume());

    expect(nextState.shouldPromptToHandleUnappliedChanges).toBe(false);
});

test(`The "openSecondaryInspector" action should set the secondaryInspectorIsOpen state to true`, () => {
    const state = {
        secondaryInspectorIsOpen: false
    };
    const nextState = reducer(state, actions.openSecondaryInspector());

    expect(nextState.secondaryInspectorIsOpen).toBe(true);
});

test(`The "closeSecondaryInspector" action should set the secondaryInspectorIsOpen state to false`, () => {
    const state = {
        secondaryInspectorIsOpen: true
    };
    const nextState = reducer(state, actions.closeSecondaryInspector());

    expect(nextState.secondaryInspectorIsOpen).toBe(false);
});

test(`The "toggleSecondaryInspector" action should negate the secondaryInspectorIsOpen state`, () => {
    const state = {
        secondaryInspectorIsOpen: true
    };
    const nextState1 = reducer(state, actions.toggleSecondaryInspector());
    const nextState2 = reducer(nextState1, actions.toggleSecondaryInspector());

    expect(nextState1.secondaryInspectorIsOpen).toBe(false);
    expect(nextState2.secondaryInspectorIsOpen).toBe(true);
});
