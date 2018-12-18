import {actionTypes, actions, reducer, selectors} from './index';

import {actionTypes as system} from '../../System/index';

test(`should export actionTypes`, () => {
    expect(actionTypes).not.toBe(undefined);
    expect(typeof (actionTypes.SET_PREVIEW_URL)).toBe('string');
    expect(typeof (actionTypes.SET_SRC)).toBe('string');
    expect(typeof (actionTypes.FORMATTING_UNDER_CURSOR)).toBe('string');
    expect(typeof (actionTypes.SET_CURRENTLY_EDITED_PROPERTY_NAME)).toBe('string');
    expect(typeof (actionTypes.START_LOADING)).toBe('string');
    expect(typeof (actionTypes.STOP_LOADING)).toBe('string');
});

test(`should export action creators`, () => {
    expect(actions).not.toBe(undefined);
    expect(typeof (actions.startLoading)).toBe('function');
    expect(typeof (actions.stopLoading)).toBe('function');
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

test(`The reducer should return plain object as the initial state.`, () => {
    const state = undefined;
    const nextState = reducer(state, {
        type: system.INIT,
        payload: {
            ui: {
                contentCanvas: {}
            }
        }
    });

    expect(typeof nextState).toBe('object');
});

test(`The "setSrc" action should set the currently opened documents src uri.`, () => {
    const state = undefined;

    const nextState1 = reducer(state, actions.setSrc('http://www.some-source.com/document.html'));
    const nextState2 = reducer(state, actions.setSrc('http://www.some-other-source.com/document.html'));
    const nextState3 = reducer(nextState1, actions.setSrc('http://www.some-other-source.com/document.html'));

    expect(nextState1.src).toBe('http://www.some-source.com/document.html');
    expect(nextState2.src).toBe('http://www.some-other-source.com/document.html');
    expect(nextState3.src).toBe('http://www.some-other-source.com/document.html');
});

test(`The "startLoading" action should set the proper loading flag.`, () => {
    const state = {
        isLoading: false
    };

    const nextState = reducer(state, actions.startLoading());
    expect(nextState.isLoading).toBe(true);
});

test(`The "stopLoading" action should set the proper loading flag.`, () => {
    const state = {
        isLoading: true
    };

    const nextState = reducer(state, actions.stopLoading());
    expect(nextState.isLoading).toBe(false);
});
