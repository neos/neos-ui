import Immutable from 'immutable';
import {$all, $set, $get} from 'plow-js';

import {actionTypes, actions, reducer, selectors} from './index.js';

import {actionTypes as system} from '../../System/index';

const fixtures = {};

fixtures.focusedNodeStateWithEmptyInspector = $all(
    $set('cr.nodes.byContextPath', {
        '/my/path@user-foo': {
            contextPath: '/my/path@user-foo'
        }
    }),
    $set('cr.nodes.focused.contextPath', '/my/path@user-foo'),
    $set('ui.inspector.valuesByNodePath', {}),
    {}
);

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
    expect(typeof (selectors.viewConfiguration)).toBe('function');
});

test(`The reducer should return an Immutable.Map as the initial state.`, () => {
    const state = new Immutable.Map({});
    const nextState = reducer(state, {
        type: system.INIT
    });

    expect($get('ui.inspector', nextState) instanceof Immutable.Map).toBe(true);
    expect($get('ui.inspector.valuesByNodePath', nextState) instanceof Immutable.Map).toBe(true);
});

test(`The initial state should not be dirty`, () => {
    const state = new Immutable.Map({});
    const nextState = reducer(state, {
        type: system.INIT
    });

    expect(selectors.isDirty(nextState)).toBe(false);
});

test(`The initial state should not be forcing apply`, () => {
    const state = new Immutable.Map({});
    const nextState = reducer(state, {
        type: system.INIT
    });

    expect(selectors.shouldPromptToHandleUnappliedChanges(nextState)).toBe(false);
});

test(`The "commit" action should store the last modification on the currently focused node.`, () => {
    const state = Immutable.fromJS(fixtures.focusedNodeStateWithEmptyInspector);
    const nextState1 = reducer(state, actions.commit('test', 'value'));
    const nextState2 = reducer(state, actions.commit('test', 'another value'));
    const nextState3 = reducer(nextState1, actions.commit('test', 'another value'));
    const nextState4 = reducer(nextState1, actions.commit('test', 'another value', {some: 'hook'}));

    expect(nextState1).toMatchSnapshot();
    expect(nextState2).toMatchSnapshot();
    expect(nextState3).toMatchSnapshot();
    expect(nextState4).toMatchSnapshot();
});

test(`The "commit" action should ignore the last modification, if it doesn't differ from the current node state`, () => {
    const state = Immutable.fromJS($set(
        'cr.nodes.byContextPath./my/path@user-foo.properties.title',
        'Foo',
        fixtures.focusedNodeStateWithEmptyInspector
    ));
    const nextState = reducer(state, actions.commit('title', 'Foo'));

    expect(nextState).toMatchSnapshot();
});

test(`The "clear" action should remove pending changes for the currently focused node.`, () => {
    const state = Immutable.fromJS($set(
        'ui.inspector.valuesByNodePath',
        {
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
        },
        fixtures.focusedNodeStateWithEmptyInspector
    ));
    const nextState1 = reducer(state, actions.clear());
    const nextState2 = reducer(nextState1, actions.clear());

    expect(nextState1).toMatchSnapshot();
    expect(nextState2).toMatchSnapshot();
});

test(`The "clear" action should reset the shouldPromptToHandleUnappliedChanges state to false`, () => {
    const state = Immutable.fromJS(
        $set('ui.inspector.shouldPromptToHandleUnappliedChanges', true, {})
    );
    const nextState = reducer(state, actions.clear());

    expect($get('ui.inspector.shouldPromptToHandleUnappliedChanges', nextState)).toBe(false);
});

test(`The "discard" action should remove pending changes for the currently focused node.`, () => {
    const state = Immutable.fromJS($set(
        'ui.inspector.valuesByNodePath',
        {
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
        },
        fixtures.focusedNodeStateWithEmptyInspector
    ));
    const nextState1 = reducer(state, actions.discard());
    const nextState2 = reducer(nextState1, actions.discard());

    expect(nextState1).toMatchSnapshot();
    expect(nextState2).toMatchSnapshot();
});

test(`The "discard" action should reset the shouldPromptToHandleUnappliedChanges state to false`, () => {
    const state = Immutable.fromJS(
        $set('ui.inspector.shouldPromptToHandleUnappliedChanges', true, {})
    );
    const nextState = reducer(state, actions.discard());

    expect($get('ui.inspector.shouldPromptToHandleUnappliedChanges', nextState)).toBe(false);
});

test(`The "escape" action should reset the shouldPromptToHandleUnappliedChanges state to true`, () => {
    const state = Immutable.fromJS(
        $set('ui.inspector.shouldPromptToHandleUnappliedChanges', false, {})
    );
    const nextState = reducer(state, actions.escape());

    expect($get('ui.inspector.shouldPromptToHandleUnappliedChanges', nextState)).toBe(true);
});

test(`The "resume" action should reset the shouldPromptToHandleUnappliedChanges state to false`, () => {
    const state = Immutable.fromJS(
        $set('ui.inspector.shouldPromptToHandleUnappliedChanges', true, {})
    );
    const nextState = reducer(state, actions.resume());

    expect($get('ui.inspector.shouldPromptToHandleUnappliedChanges', nextState)).toBe(false);
});

test(`The "openSecondaryInspector" action should set the secondaryInspectorIsOpen state to true`, () => {
    const state = Immutable.fromJS(
        $set('ui.inspector.secondaryInspectorIsOpen', false, {})
    );
    const nextState = reducer(state, actions.openSecondaryInspector());

    expect($get('ui.inspector.secondaryInspectorIsOpen', nextState)).toBe(true);
});

test(`The "closeSecondaryInspector" action should set the secondaryInspectorIsOpen state to false`, () => {
    const state = Immutable.fromJS(
        $set('ui.inspector.secondaryInspectorIsOpen', true, {})
    );
    const nextState = reducer(state, actions.closeSecondaryInspector());

    expect($get('ui.inspector.secondaryInspectorIsOpen', nextState)).toBe(false);
});

test(`The "toggleSecondaryInspector" action should negate the secondaryInspectorIsOpen state`, () => {
    const state = Immutable.fromJS(
        $set('ui.inspector.secondaryInspectorIsOpen', true, {})
    );
    const nextState1 = reducer(state, actions.toggleSecondaryInspector());
    const nextState2 = reducer(nextState1, actions.toggleSecondaryInspector());

    expect($get('ui.inspector.secondaryInspectorIsOpen', nextState1)).toBe(false);
    expect($get('ui.inspector.secondaryInspectorIsOpen', nextState2)).toBe(true);
});
