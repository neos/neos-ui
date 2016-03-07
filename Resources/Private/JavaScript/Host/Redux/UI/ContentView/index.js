import {createAction} from 'redux-actions';
import {$set} from 'plow-js';

const SET_CONTEXT_PATH = '@packagefactory/guevara/UI/PageTree/SET_CONTEXT_PATH';
const SET_SRC = '@packagefactory/guevara/UI/PageTree/SET_SRC';

//
// Export the action types
//
export const actionTypes = {
    SET_CONTEXT_PATH,
    SET_SRC
};

const setContextPath = createAction(SET_CONTEXT_PATH, contextPath => ({contextPath}));
const setSrc = createAction(SET_SRC, src => ({src}));

//
// Export the actions
//
export const actions = {
    setContextPath,
    setSrc
};

//
// Export the initial state
//
export const initialState = {
    contextPath: '',
    src: ''
};

//
// Export the reducer
//
export const reducer = {
    [SET_CONTEXT_PATH]: ({contextPath}) => $set('ui.contentView.contextPath', contextPath),
    [SET_SRC]: ({src}) => src ? $set('ui.contentView.src', src) : state => state
};
