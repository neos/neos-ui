import Immutable, {Map} from 'immutable';

import {actionTypes, actions, reducer, selectors} from './index.js';

import {actionTypes as system} from '../../System/index';

test(`should export actionTypes`, () => {
    expect(actionTypes).not.toBe(undefined);
    expect(typeof (actionTypes.SET_CONTEXT_PATH)).toBe('string');
    expect(typeof (actionTypes.SET_PREVIEW_URL)).toBe('string');
    expect(typeof (actionTypes.SET_SRC)).toBe('string');
    expect(typeof (actionTypes.FORMATTING_UNDER_CURSOR)).toBe('string');
    expect(typeof (actionTypes.SET_CURRENTLY_EDITED_PROPERTY_NAME)).toBe('string');
});

test(`should export action creators`, () => {
    expect(actions).not.toBe(undefined);
    expect(typeof (actions.setContextPath)).toBe('function');
    expect(typeof (actions.setPreviewUrl)).toBe('function');
    expect(typeof (actions.setSrc)).toBe('function');
    expect(typeof (actions.setFormattingUnderCursor)).toBe('function');
    expect(typeof (actions.setCurrentlyEditedPropertyName)).toBe('function');
});

test(`should export a reducer`, () => {
    expect(reducer).not.toBe(undefined);
    expect(typeof (reducer)).toBe('function');
});

test(`should export selectors`, () => {
    expect(selectors).not.toBe(undefined);
    expect(typeof (selectors.currentlyEditedPropertyName)).toBe('function');
    expect(typeof (selectors.formattingUnderCursor)).toBe('function');
});

test(`The reducer should return an Immutable.Map as the initial state.`, () => {
    const state = new Map({});
    const nextState = reducer(state, {
        type: system.INIT
    });

    expect(nextState.get('ui').get('contentCanvas') instanceof Map).toBe(true);
});

test(`The "setContextPath" action should set the currently opened documents context path.`, () => {
    const state = Immutable.fromJS({
        ui: {
            contentCanvas: {
                contextPath: ''
            }
        }
    });
    const nextState1 = reducer(state, actions.setContextPath('someContextPath'));
    const nextState2 = reducer(state, actions.setContextPath('someOtherContextPath'));
    const nextState3 = reducer(nextState1, actions.setContextPath('someOtherContextPath'));

    expect(nextState1.get('ui').get('contentCanvas').get('contextPath')).toBe('someContextPath');
    expect(nextState2.get('ui').get('contentCanvas').get('contextPath')).toBe('someOtherContextPath');
    expect(nextState3.get('ui').get('contentCanvas').get('contextPath')).toBe('someOtherContextPath');
});

test(`The "setSrc" action should set the currently opened documents src uri.`, () => {
    const state = Immutable.fromJS({
        ui: {
            contentCanvas: {
                src: ''
            }
        }
    });

    const nextState1 = reducer(state, actions.setSrc('http://www.some-source.com/document.html'));
    const nextState2 = reducer(state, actions.setSrc('http://www.some-other-source.com/document.html'));
    const nextState3 = reducer(nextState1, actions.setSrc('http://www.some-other-source.com/document.html'));

    expect(nextState1.get('ui').get('contentCanvas').get('src')).toBe('http://www.some-source.com/document.html');
    expect(nextState2.get('ui').get('contentCanvas').get('src')).toBe('http://www.some-other-source.com/document.html');
    expect(nextState3.get('ui').get('contentCanvas').get('src')).toBe('http://www.some-other-source.com/document.html');
});
