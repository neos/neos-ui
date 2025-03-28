import {actionTypes, actions, reducer} from './index';
import {SelectionModeTypes} from '@neos-project/neos-ts-interfaces';

import {actions as system} from '../../System/index';
import {actions as nodes} from '../../CR/Nodes/index';

test(`should export actionTypes`, () => {
    expect(actionTypes).not.toBe(undefined);
    expect(typeof (actionTypes.FOCUS)).toBe('string');
    expect(typeof (actionTypes.TOGGLE)).toBe('string');
    expect(typeof (actionTypes.INVALIDATE)).toBe('string');
    expect(typeof (actionTypes.REQUEST_CHILDREN)).toBe('string');
});

test(`should export action creators`, () => {
    expect(actions).not.toBe(undefined);
    expect(typeof (actions.focus)).toBe('function');
    expect(typeof (actions.toggle)).toBe('function');
    expect(typeof (actions.invalidate)).toBe('function');
    expect(typeof (actions.requestChildren)).toBe('function');
});

test(`should export a reducer`, () => {
    expect(reducer).not.toBe(undefined);
    expect(typeof (reducer)).toBe('function');
});

test(`The reducer should return a plain JS object as the initial state.`, () => {
    const nextState = reducer(undefined, system.init({
        ui: {
            pageTree: {}
        },
        cr: {
            nodes: {
                siteNode: 'siteNode',
                documentNode: 'documentNode'
            }
        }
    }));

    expect(typeof nextState).toBe('object');
});

test(`The "focus" action should set the focused node context path.`, () => {
    const globalState = {
        ui: {
            focused: [],
            toggled: [],
            visible: [],
            intermediate: [],
            loading: [],
            errors: []
        },
        cr: {
            nodes: {
                siteNode: 'siteNode',
                documentNode: 'documentNode',
                byContextPath: []
            }
        }
    };
    const nextState = reducer(globalState.ui, actions.focus('someOtherContextPath', undefined, SelectionModeTypes.SINGLE_SELECT), globalState);
    expect(nextState.focused).toEqual(['someOtherContextPath']);
});

test(`The "invalidate" action should remove the given node from toggled state`, () => {
    const state = {
        loading: [],
        errors: [],
        toggled: ['someContextPath', 'someOtherContextPath']
    };
    const nextState1 = reducer(state, actions.invalidate('someContextPath'));
    const nextState2 = reducer(state, actions.invalidate('someOtherContextPath'));
    const nextState3 = reducer(nextState1, actions.invalidate('someOtherContextPath'));

    expect(nextState1.toggled).toEqual(['someOtherContextPath']);
    expect(nextState2.toggled).toEqual(['someContextPath']);
    expect(nextState3.toggled).toEqual([]);
});

test(`The "invalidate" action should remove the given node from loading state`, () => {
    const state = {
        toggled: [],
        errors: [],
        loading: ['someContextPath', 'someOtherContextPath']
    };
    const nextState1 = reducer(state, actions.invalidate('someContextPath'));
    const nextState2 = reducer(state, actions.invalidate('someOtherContextPath'));
    const nextState3 = reducer(nextState1, actions.invalidate('someOtherContextPath'));

    expect(nextState1.loading).toEqual(['someOtherContextPath']);
    expect(nextState2.loading).toEqual(['someContextPath']);
    expect(nextState3.loading).toEqual([]);
});

test(`The "invalidate" action should add the given node to error state`, () => {
    const state = {
        toggled: [],
        loading: [],
        errors: []
    };
    const nextState1 = reducer(state, actions.invalidate('someContextPath'));
    const nextState2 = reducer(state, actions.invalidate('someOtherContextPath'));
    const nextState3 = reducer(nextState1, actions.invalidate('someOtherContextPath'));

    expect(nextState1.errors).toEqual(['someContextPath']);
    expect(nextState2.errors).toEqual(['someOtherContextPath']);
    expect(nextState3.errors).toEqual(['someContextPath', 'someOtherContextPath']);
});

test(`The "setAsLoading" action should remove the given node from error state`, () => {
    const state = {
        toggled: [],
        loading: [],
        errors: ['someContextPath', 'someOtherContextPath']
    };
    const nextState1 = reducer(state, actions.setAsLoading('someContextPath'));
    const nextState2 = reducer(state, actions.setAsLoading('someOtherContextPath'));
    const nextState3 = reducer(nextState1, actions.setAsLoading('someOtherContextPath'));

    expect(nextState1.errors).toEqual(['someOtherContextPath']);
    expect(nextState2.errors).toEqual(['someContextPath']);
    expect(nextState3.errors).toEqual([]);
});

test(`The "setAsLoading" action should add the given node to loading state`, () => {
    const state = {
        toggled: [],
        errors: [],
        loading: []
    };
    const nextState1 = reducer(state, actions.setAsLoading('someContextPath'));
    const nextState2 = reducer(state, actions.setAsLoading('someOtherContextPath'));
    const nextState3 = reducer(nextState1, actions.setAsLoading('someOtherContextPath'));

    expect(nextState1.loading).toEqual(['someContextPath']);
    expect(nextState2.loading).toEqual(['someOtherContextPath']);
    expect(nextState3.loading).toEqual(['someContextPath', 'someOtherContextPath']);
});

test(`The "setAsLoaded" action should remove the given node to loading state`, () => {
    const state = {
        toggled: [],
        errors: [],
        loading: ['someContextPath', 'someOtherContextPath']
    };
    const nextState1 = reducer(state, actions.setAsLoaded('someContextPath'));
    const nextState2 = reducer(state, actions.setAsLoaded('someOtherContextPath'));
    const nextState3 = reducer(nextState1, actions.setAsLoaded('someOtherContextPath'));

    expect(nextState1.loading).toEqual(['someOtherContextPath']);
    expect(nextState2.loading).toEqual(['someContextPath']);
    expect(nextState3.loading).toEqual([]);
});

test(`"visible" state is initially null`, () => {
    const state = reducer(undefined, system.init({
        cr: {
            nodes: {
                siteNode: 'siteNode',
                documentNode: 'documentNode'
            }
        }
    }));

    expect(state.visible).toBeNull();
});

test(`"visible" state can be set to an array of context paths by SET_SEARCH_RESULT action`, () => {
    const state = reducer({visible: null}, actions.setSearchResult({
        visibleContextPaths: ['some-visible-context-path'],
        toggledContextPaths: [],
        intermediateContextPaths: []
    }));

    expect(state.visible).toStrictEqual(['some-visible-context-path']);
});

test(`"visible" state can be set to null by SET_SEARCH_RESULT action`, () => {
    const state = reducer({visible: null}, actions.setSearchResult({
        visibleContextPaths: null,
        toggledContextPaths: [],
        intermediateContextPaths: []
    }));

    expect(state.visible).toBeNull();
});

test(`When "visible" state is null and CR.Nodes.ADD occurs, "visible" state remains null`, () => {
    const state = reducer({visible: null}, nodes.add({
        'some-visible-context-path': {},
        'some-other-context-path': {}
    }));

    expect(state.visible).toBeNull();
});

test(`When "visible" state is not null and CR.Nodes.ADD occurs, all added nodes are made visible`, () => {
    const state = reducer({visible: ['some-visible-context-path']}, nodes.add({
        'some-visible-context-path': {},
        'some-other-context-path': {}
    }));

    expect(state.visible).toStrictEqual([
        'some-visible-context-path',
        'some-other-context-path'
    ]);
});

test(`When "visible" state is null and CR.Nodes.MERGE occurs, "visible" state remains null`, () => {
    const state = reducer({visible: null}, nodes.merge({
        'some-visible-context-path': {},
        'some-other-context-path': {}
    }));

    expect(state.visible).toBeNull();
});

test(`When "visible" state is not null and CR.Nodes.MERGE occurs, all added nodes are made visible`, () => {
    const state = reducer({visible: ['some-visible-context-path']}, nodes.merge({
        'some-visible-context-path': {},
        'some-other-context-path': {}
    }));

    expect(state.visible).toStrictEqual([
        'some-visible-context-path',
        'some-other-context-path'
    ]);
});

test(`When "visible" state is null and CR.Nodes.SET_STATE occurs, "visible" state remains null`, () => {
    const state = reducer({visible: null}, nodes.setState({
        siteNodeContextPath: 'siteNode',
        documentNodeContextPath: 'documentNode',
        nodes: {
            'some-visible-context-path': {},
            'some-other-context-path': {}
        },
        merge: true
    }));

    expect(state.visible).toBeNull();
});

test(`When "visible" state is not null and CR.Nodes.SET_STATE occurs, all added nodes are made visible`, () => {
    const state = reducer({visible: ['some-visible-context-path']}, nodes.setState({
        siteNodeContextPath: 'siteNode',
        documentNodeContextPath: 'documentNode',
        nodes: {
            'some-visible-context-path': {},
            'some-other-context-path': {}
        },
        merge: true
    }));

    expect(state.visible).toStrictEqual([
        'some-visible-context-path',
        'some-other-context-path'
    ]);
});

test(`When "visible" state is null and CR.Nodes.UPDATE_PATH occurs, "visible" state remains null`, () => {
    const state = reducer({visible: null}, nodes.updatePath(
        'some-visible-context-path',
        'some-visible-context-path-with-a-different-name'
    ));

    expect(state.visible).toBeNull();
});

test(`When "visible" state is not null and CR.Nodes.UPDATE_PATH occurs, the context path will be updated in "visible" as well`, () => {
    const state = reducer({visible: ['some-visible-context-path']}, nodes.updatePath(
        'some-visible-context-path',
        'some-visible-context-path-with-a-different-name'
    ));

    expect(state.visible).toStrictEqual([
        'some-visible-context-path-with-a-different-name'
    ]);
});

test(`When "visible" state is not null and CR.Nodes.UPDATE_PATH occurs with an unknown old context path, the new context path will be added to "visible"`, () => {
    const state = reducer({visible: ['some-visible-context-path']}, nodes.updatePath(
        'another-visible-context-path',
        'another-visible-context-path-with-a-different-name'
    ));

    expect(state.visible).toStrictEqual([
        'some-visible-context-path',
        'another-visible-context-path-with-a-different-name'
    ]);
});
