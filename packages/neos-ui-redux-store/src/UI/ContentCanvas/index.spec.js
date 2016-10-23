import test from 'ava';
import Immutable, {Map} from 'immutable';

import {actionTypes, actions, reducer, selectors} from './index.js';

import {actionTypes as system} from '../../System/index';

test(`should export actionTypes`, t => {
    t.not(actionTypes, undefined);
    t.is(typeof (actionTypes.SET_CONTEXT_PATH), 'string');
    t.is(typeof (actionTypes.SET_PREVIEW_URL), 'string');
    t.is(typeof (actionTypes.SET_SRC), 'string');
    t.is(typeof (actionTypes.FORMATTING_UNDER_CURSOR), 'string');
    t.is(typeof (actionTypes.SET_CURRENTLY_EDITED_PROPERTY_NAME), 'string');
});

test(`should export action creators`, t => {
    t.not(actions, undefined);
    t.is(typeof (actions.setContextPath), 'function');
    t.is(typeof (actions.setPreviewUrl), 'function');
    t.is(typeof (actions.setSrc), 'function');
    t.is(typeof (actions.formattingUnderCursor), 'function');
    t.is(typeof (actions.setCurrentlyEditedPropertyName), 'function');
});

test(`should export a reducer`, t => {
    t.not(reducer, undefined);
    t.is(typeof (reducer), 'function');
});

test(`should export selectors`, t => {
    t.not(selectors, undefined);
    t.is(typeof (selectors.currentlyEditedPropertyName), 'function');
    t.is(typeof (selectors.formattingUnderCursor), 'function');
});

test(`The reducer should return an Immutable.Map as the initial state.`, t => {
    const state = new Map({});
    const nextState = reducer(state, {
        type: system.INIT
    });

    t.true(nextState.get('ui').get('contentCanvas') instanceof Map);
});

test(`The "setContextPath" action should set the currently opened documents context path.`, t => {
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

    t.is(nextState1.get('ui').get('contentCanvas').get('contextPath'), 'someContextPath');
    t.is(nextState2.get('ui').get('contentCanvas').get('contextPath'), 'someOtherContextPath');
    t.is(nextState3.get('ui').get('contentCanvas').get('contextPath'), 'someOtherContextPath');
});

test(`The "setSrc" action should set the currently opened documents src uri.`, t => {
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

    t.is(nextState1.get('ui').get('contentCanvas').get('src'), 'http://www.some-source.com/document.html');
    t.is(nextState2.get('ui').get('contentCanvas').get('src'), 'http://www.some-other-source.com/document.html');
    t.is(nextState3.get('ui').get('contentCanvas').get('src'), 'http://www.some-other-source.com/document.html');
});
