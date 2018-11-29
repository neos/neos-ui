import {createAction} from 'redux-actions';
import {Map} from 'immutable';
import {$set, $get, $all} from 'plow-js';

import {handleActions} from '@neos-project/utils-redux';

import {actionTypes as system} from '../../System/index';

import * as selectors from './selectors';

const SET_PREVIEW_URL = '@neos/neos-ui/UI/ContentCanvas/SET_PREVIEW_URL';
const SET_SRC = '@neos/neos-ui/UI/ContentCanvas/SET_SRC';
const FORMATTING_UNDER_CURSOR = '@neos/neos-ui/UI/ContentCanvas/FORMATTING_UNDER_CURSOR';
const SET_CURRENTLY_EDITED_PROPERTY_NAME = '@neos/neos-ui/UI/ContentCanvas/SET_CURRENTLY_EDITED_PROPERTY_NAME';
const START_LOADING = '@neos/neos-ui/UI/ContentCanvas/START_LOADING';
const STOP_LOADING = '@neos/neos-ui/UI/ContentCanvas/STOP_LOADING';
const RELOAD = '@neos/neos-ui/UI/ContentCanvas/RELOAD';
const FOCUS_PROPERTY = '@neos/neos-ui/UI/ContentCanvas/FOCUS_PROPERTY';
const REQUEST_SCROLL_INTO_VIEW = '@neos/neos-ui/UI/ContentCanvas/REQUEST_SCROLL_INTO_VIEW';
const REQUEST_REGAIN_CONTROL = '@neos/neos-ui/UI/ContentCanvas/REQUEST_REGAIN_CONTROL';
const REQUEST_LOGIN = '@neos/neos-ui/UI/ContentCanvas/REQUEST_LOGIN';

//
// Export the action types
//
export const actionTypes = {
    SET_PREVIEW_URL,
    SET_SRC,
    FORMATTING_UNDER_CURSOR,
    SET_CURRENTLY_EDITED_PROPERTY_NAME,
    START_LOADING,
    STOP_LOADING,
    RELOAD,
    FOCUS_PROPERTY,
    REQUEST_SCROLL_INTO_VIEW,
    REQUEST_REGAIN_CONTROL,
    REQUEST_LOGIN
};

const setPreviewUrl = createAction(SET_PREVIEW_URL, previewUrl => ({previewUrl}));
const setSrc = createAction(SET_SRC, (src, openInNewWindow = false) => ({src, openInNewWindow}));
const setFormattingUnderCursor = createAction(FORMATTING_UNDER_CURSOR, formatting => ({formatting}));
const setCurrentlyEditedPropertyName = createAction(SET_CURRENTLY_EDITED_PROPERTY_NAME, propertyName => ({propertyName}));
const startLoading = createAction(START_LOADING);
const stopLoading = createAction(STOP_LOADING);
const reload = createAction(RELOAD, uri => ({uri}));
// Set a flag to tell ContentCanvas to scroll the focused node into view
const requestScrollIntoView = createAction(REQUEST_SCROLL_INTO_VIEW, activate => activate);
// If we have lost controll over the iframe, we need to take action
const requestRegainControl = createAction(REQUEST_REGAIN_CONTROL, (src, errorMessage) => ({src, errorMessage}));
const requestLogin = createAction(REQUEST_LOGIN);

//
// Export the actions
//
export const actions = {
    setPreviewUrl,
    setSrc,
    setFormattingUnderCursor,
    setCurrentlyEditedPropertyName,
    startLoading,
    stopLoading,
    reload,
    requestScrollIntoView,
    requestRegainControl,
    requestLogin
};

//
// Export the reducer
//
export const reducer = handleActions({
    [system.INIT]: state => $set(
        'ui.contentCanvas',
        new Map({
            previewUrl: '',
            src: $get('ui.contentCanvas.src', state) || '',
            formattingUnderCursor: new Map(),
            currentlyEditedPropertyName: '',
            currentlyEditedPropertyNameIntermediate: '',
            isLoading: true,
            focusedProperty: '',
            backgroundColor: $get('ui.contentCanvas.backgroundColor', state),
            shouldScrollIntoView: false
        })
    ),
    [SET_PREVIEW_URL]: ({previewUrl}) => $set('ui.contentCanvas.previewUrl', previewUrl),
    [SET_SRC]: ({src}) => $set('ui.contentCanvas.src', src),
    [FORMATTING_UNDER_CURSOR]: ({formatting}) => $set('ui.contentCanvas.formattingUnderCursor', new Map(formatting)),
    [SET_CURRENTLY_EDITED_PROPERTY_NAME]: ({propertyName}) => $all(
        $set('ui.contentCanvas.currentlyEditedPropertyName', propertyName),
        // See SET_FOCUS why it's needed
        $set('ui.contentCanvas.currentlyEditedPropertyNameIntermediate', propertyName)
    ),
    [STOP_LOADING]: () => $set('ui.contentCanvas.isLoading', false),
    [START_LOADING]: () => $set('ui.contentCanvas.isLoading', true),
    [REQUEST_SCROLL_INTO_VIEW]: activate => $set('ui.contentCanvas.shouldScrollIntoView', activate),
    [REQUEST_REGAIN_CONTROL]: () => $set('ui.contentCanvas.src', '')
});

//
// Export the selectors
//
export {selectors};
