import {createAction} from 'redux-actions';
import {Map} from 'immutable';
import {$set, $get} from 'plow-js';

const SET_CONTEXT_PATH = '@packagefactory/guevara/UI/PageTree/SET_CONTEXT_PATH';
const SET_PREVIEW_URL = '@packagefactory/guevara/UI/PageTree/SET_PREVIEW_URL';
const SET_SRC = '@packagefactory/guevara/UI/PageTree/SET_SRC';

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
// Export the initial state hydrator
//
export const hydrate = state => $set(
    'ui.contentView',
    new Map({
        contextPath: $get('ui.contentView.contextPath', state) || '',
        previewUrl: '',
        src: $get('ui.contentView.src', state) || ''
    })
);

//
// Export the reducer
//
export const reducer = {
    [SET_CONTEXT_PATH]: ({contextPath}) => $set('ui.contentView.contextPath', contextPath),
    [SET_PREVIEW_URL]: ({previewUrl}) => $set('ui.contentView.previewUrl', previewUrl),
    [SET_SRC]: ({src}) => src ? $set('ui.contentView.src', src) : state => state
};
