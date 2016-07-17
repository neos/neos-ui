import {createAction} from 'redux-actions';
import {Map} from 'immutable';
import {$set, $get} from 'plow-js';

import {handleActions} from 'Shared/Utilities/index';
import {actionTypes as system} from 'Host/Redux/System/index';

const SET_CONTEXT_PATH = '@neos/neos-ui/UI/ContentCanvas/SET_CONTEXT_PATH';
const SET_PREVIEW_URL = '@neos/neos-ui/UI/ContentCanvas/SET_PREVIEW_URL';
const SET_SRC = '@neos/neos-ui/UI/ContentCanvas/SET_SRC';

//
// Export the action types
//
export const actionTypes = {
    SET_CONTEXT_PATH,
    SET_PREVIEW_URL,
    SET_SRC
};

const setContextPath = createAction(SET_CONTEXT_PATH, contextPath => ({contextPath}));
const setPreviewUrl = createAction(SET_PREVIEW_URL, previewUrl => ({previewUrl}));
const setSrc = createAction(SET_SRC, src => ({src}));

//
// Export the actions
//
export const actions = {
    setContextPath,
    setPreviewUrl,
    setSrc
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
            src: $get('ui.contentCanvas.src', state) || ''
        })
    ),
    [SET_CONTEXT_PATH]: ({contextPath}) => $set('ui.contentCanvas.contextPath', contextPath),
    [SET_PREVIEW_URL]: ({previewUrl}) => $set('ui.contentCanvas.previewUrl', previewUrl),
    [SET_SRC]: ({src}) => src ? $set('ui.contentCanvas.src', src) : state => state
});
