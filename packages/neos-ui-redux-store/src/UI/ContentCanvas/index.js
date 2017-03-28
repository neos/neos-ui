import {createAction} from 'redux-actions';
import {Map} from 'immutable';
import {$set, $get, $all} from 'plow-js';

import {handleActions} from '@neos-project/utils-redux';

import {actionTypes as system} from '../../System/index';

import * as selectors from './selectors';

const SET_CONTEXT_PATH = '@neos/neos-ui/UI/ContentCanvas/SET_CONTEXT_PATH';
const SET_PREVIEW_URL = '@neos/neos-ui/UI/ContentCanvas/SET_PREVIEW_URL';
const SET_SRC = '@neos/neos-ui/UI/ContentCanvas/SET_SRC';
const FORMATTING_UNDER_CURSOR = '@neos/neos-ui/UI/ContentCanvas/FORMATTING_UNDER_CURSOR';
const SET_CURRENTLY_EDITED_PROPERTY_NAME = '@neos/neos-ui/UI/ContentCanvas/SET_CURRENTLY_EDITED_PROPERTY_NAME';
const STOP_LOADING = '@neos/neos-ui/UI/ContentCanvas/STOP_LOADING';

//
// Export the action types
//
export const actionTypes = {
    SET_CONTEXT_PATH,
    SET_PREVIEW_URL,
    SET_SRC,
    FORMATTING_UNDER_CURSOR,
    SET_CURRENTLY_EDITED_PROPERTY_NAME,
    STOP_LOADING
};

const setContextPath = createAction(SET_CONTEXT_PATH, (contextPath, siteNode = null) => ({contextPath, siteNode}));
const setPreviewUrl = createAction(SET_PREVIEW_URL, previewUrl => ({previewUrl}));
const setSrc = createAction(SET_SRC, src => ({src}));
const formattingUnderCursor = createAction(FORMATTING_UNDER_CURSOR, formatting => ({formatting}));
const setCurrentlyEditedPropertyName = createAction(SET_CURRENTLY_EDITED_PROPERTY_NAME, propertyName => ({propertyName}));
const stopLoading = createAction(STOP_LOADING);

//
// Export the actions
//
export const actions = {
    setContextPath,
    setPreviewUrl,
    setSrc,
    formattingUnderCursor,
    setCurrentlyEditedPropertyName,
    stopLoading
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
            isLoading: true
        })
    ),
    [SET_CONTEXT_PATH]: ({contextPath, siteNode}) => state => {
        state = $set('ui.contentCanvas.contextPath', contextPath, state);

        if (siteNode) {
            // !! HINT: set site node in case it is defined in SET_CONTEXT_PATH; otherwise the dimension switcher does not work.
            state = $set('cr.nodes.siteNode', siteNode, state);
        }

        return state;
    },
    [SET_PREVIEW_URL]: ({previewUrl}) => $set('ui.contentCanvas.previewUrl', previewUrl),
    [SET_SRC]: ({src}) => state => {
        if (src !== $get('ui.contentCanvas.src', state)) {
            state = $set('ui.contentCanvas.src', src, state);
            state = $set('ui.contentCanvas.isLoading', true, state);
        }
        return state;
    },
    [FORMATTING_UNDER_CURSOR]: ({formatting}) => $set('ui.contentCanvas.formattingUnderCursor', new Map(formatting)),
    [SET_CURRENTLY_EDITED_PROPERTY_NAME]: ({propertyName}) => $set('ui.contentCanvas.currentlyEditedPropertyName', propertyName),
    [STOP_LOADING]: () => $set('ui.contentCanvas.isLoading', false)
});

//
// Export the selectors
//
export {selectors};
