import {createAction} from 'redux-actions';
import {$override} from 'plow-js';

const SET_POSITION = '@neos/neos-ui/GUEST/CKEditorToolbar/SET_POSITION';
const SHOW = '@neos/neos-ui/GUEST/CKEditorToolbar/SHOW';
const HIDE = '@neos/neos-ui/GUEST/CKEditorToolbar/HIDE';

//
// Export the action types
//
export const actionTypes = {
    SET_POSITION,
    SHOW,
    HIDE
};

const setPosition = createAction(SET_POSITION, (x, y) => ({x, y}));
const show = createAction(SHOW, editorName => ({editorName}));
const hide = createAction(HIDE);

//
// Export the actions
//
export const actions = {
    setPosition,
    show,
    hide
};

//
// Export the initial state
//
export const initialState = {
    x: 0,
    y: 0,
    isVisible: false,
    editorName: ''
};

//
// Export the reducer
//
export const reducer = {
    [SET_POSITION]: ({x, y}) => $override('ckEditorToolbar', {x, y}),
    [SHOW]: ({editorName}) => $override('ckEditorToolbar', {
        isVisible: true,
        editorName
    }),
    [HIDE]: () => $override('ckEditorToolbar', {
        isVisible: false,
        editorName: ''
    })
};
