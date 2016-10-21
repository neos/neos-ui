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

//
// Export the action types
//
export const actionTypes = {
    SET_CONTEXT_PATH,
    SET_PREVIEW_URL,
    SET_SRC,
    FORMATTING_UNDER_CURSOR,
    SET_CURRENTLY_EDITED_PROPERTY_NAME
};

const setContextPath = createAction(SET_CONTEXT_PATH, contextPath => ({contextPath}));
const setPreviewUrl = createAction(SET_PREVIEW_URL, previewUrl => ({previewUrl}));
const setSrc = createAction(SET_SRC, src => ({src}));
const formattingUnderCursor = createAction(FORMATTING_UNDER_CURSOR, formatting => ({formatting}));
const setCurrentlyEditedPropertyName = createAction(SET_CURRENTLY_EDITED_PROPERTY_NAME, propertyName => ({propertyName}));

//
// Export the actions
//
export const actions = {
    setContextPath,
    setPreviewUrl,
    setSrc,
    formattingUnderCursor,
    setCurrentlyEditedPropertyName
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
            currentlyEditedPropertyName: ''
        })
    ),
    [SET_CONTEXT_PATH]: ({contextPath}) => $set('ui.contentCanvas.contextPath', contextPath),
    [SET_PREVIEW_URL]: ({previewUrl}) => $set('ui.contentCanvas.previewUrl', previewUrl),
    [SET_SRC]: ({src}) => src ? $set('ui.contentCanvas.src', src) : state => state,
    [FORMATTING_UNDER_CURSOR]: ({formatting}) => $set('ui.contentCanvas.formattingUnderCursor', new Map(formatting)),
    [SET_CURRENTLY_EDITED_PROPERTY_NAME]: ({propertyName}) => $set('ui.contentCanvas.currentlyEditedPropertyName', propertyName)
});

//
// Export the selectors
//
export {selectors};
