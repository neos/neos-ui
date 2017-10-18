import {createAction} from 'redux-actions';
import {Map} from 'immutable';
import {$set, $get} from 'plow-js';

import {handleActions} from '@neos-project/utils-redux';

import {actionTypes as system} from '../../System/index';

import * as selectors from './selectors';

const SET_CONTEXT_PATH = '@neos/neos-ui/UI/ContentCanvas/SET_CONTEXT_PATH';
const SET_PREVIEW_URL = '@neos/neos-ui/UI/ContentCanvas/SET_PREVIEW_URL';
const SET_SRC = '@neos/neos-ui/UI/ContentCanvas/SET_SRC';
const FORMATTING_UNDER_CURSOR = '@neos/neos-ui/UI/ContentCanvas/FORMATTING_UNDER_CURSOR';
const SET_CURRENTLY_EDITED_PROPERTY_NAME = '@neos/neos-ui/UI/ContentCanvas/SET_CURRENTLY_EDITED_PROPERTY_NAME';
const START_LOADING = '@neos/neos-ui/UI/ContentCanvas/START_LOADING';
const STOP_LOADING = '@neos/neos-ui/UI/ContentCanvas/STOP_LOADING';
const FOCUS_PROPERTY = '@neos/neos-ui/UI/ContentCanvas/FOCUS_PROPERTY';
const REQUEST_SCROLL_INTO_VIEW = '@neos/neos-ui/UI/ContentCanvas/REQUEST_SCROLL_INTO_VIEW';
const REQUEST_REGAIN_CONTROL = '@neos/neos-ui/UI/ContentCanvas/REQUEST_REGAIN_CONTROL';

//
// Export the action types
//
export const actionTypes = {
    SET_CONTEXT_PATH,
    SET_PREVIEW_URL,
    SET_SRC,
    FORMATTING_UNDER_CURSOR,
    SET_CURRENTLY_EDITED_PROPERTY_NAME,
    START_LOADING,
    STOP_LOADING,
    FOCUS_PROPERTY,
    REQUEST_SCROLL_INTO_VIEW,
    REQUEST_REGAIN_CONTROL
};

const setContextPath = createAction(SET_CONTEXT_PATH, (contextPath, siteNode = null) => ({contextPath, siteNode}));
const setPreviewUrl = createAction(SET_PREVIEW_URL, previewUrl => ({previewUrl}));
const setSrc = createAction(SET_SRC, src => ({src}));
const setFormattingUnderCursor = createAction(FORMATTING_UNDER_CURSOR, formatting => ({formatting}));
const setCurrentlyEditedPropertyName = createAction(SET_CURRENTLY_EDITED_PROPERTY_NAME, propertyName => ({propertyName}));
const startLoading = createAction(START_LOADING);
const stopLoading = createAction(STOP_LOADING);
// Set a flag to tell ContentCanvas to scroll the focused node into view
const requestScrollIntoView = createAction(REQUEST_SCROLL_INTO_VIEW, activate => activate);
// If we have lost controll over the iframe, we need to take action
const requestRegainControl = createAction(REQUEST_REGAIN_CONTROL, (src, errorMessage) => ({src, errorMessage}));

//
// Export the actions
//
export const actions = {
    setContextPath,
    setPreviewUrl,
    setSrc,
    setFormattingUnderCursor,
    setCurrentlyEditedPropertyName,
    startLoading,
    stopLoading,
    requestScrollIntoView,
    requestRegainControl
};

//
// Export the reducer
//
export const reducer = handleActions({
    [system.INIT]: state => $set(
        'ui.contentCanvas',
        new Map({
            contextPath: $get('ui.contentCanvas.contextPath', state) || '',
            previewUrl: '',
            src: $get('ui.contentCanvas.src', state) || '',
            formattingUnderCursor: new Map(),
            currentlyEditedPropertyName: '',
            isLoading: true,
            focusedProperty: '',
            backgroundColor: $get('ui.contentCanvas.backgroundColor', state),
            shouldScrollIntoView: false
        })
    ),
    [SET_CONTEXT_PATH]: ({contextPath, siteNode}) => state => {
        if ($get('ui.contentCanvas.contextPath', state) !== contextPath) {
            // If context path changed, ensure to reset the "focused node". Otherwise, when switching
            // to different Document nodes and having a (content) node selected previously, the Inspector
            // does not properly refresh. We just need to ensure that everytime we switch pages, we
            // reset the focused (content) node of the page.
            state = $set('cr.nodes.focused', new Map({
                contextPath: '',
                fusionPath: ''
            }), state);
        }

        state = $set('ui.contentCanvas.contextPath', contextPath, state);

        if (siteNode) {
            // !! HINT: set site node in case it is defined in SET_CONTEXT_PATH; otherwise the dimension switcher does not work.
            state = $set('cr.nodes.siteNode', siteNode, state);
        }

        return state;
    },
    [SET_PREVIEW_URL]: ({previewUrl}) => $set('ui.contentCanvas.previewUrl', previewUrl),
    [SET_SRC]: ({src}) => $set('ui.contentCanvas.src', src),
    [FORMATTING_UNDER_CURSOR]: ({formatting}) => $set('ui.contentCanvas.formattingUnderCursor', new Map(formatting)),
    [SET_CURRENTLY_EDITED_PROPERTY_NAME]: ({propertyName}) => $set('ui.contentCanvas.currentlyEditedPropertyName', propertyName),
    [STOP_LOADING]: () => $set('ui.contentCanvas.isLoading', false),
    [START_LOADING]: () => $set('ui.contentCanvas.isLoading', true),
    [REQUEST_SCROLL_INTO_VIEW]: activate => $set('ui.contentCanvas.shouldScrollIntoView', activate),
    [REQUEST_REGAIN_CONTROL]: () => $set('ui.contentCanvas.src', '')
});

//
// Export the selectors
//
export {selectors};
