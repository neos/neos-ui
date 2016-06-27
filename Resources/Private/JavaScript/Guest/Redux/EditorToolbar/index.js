import {createAction} from 'redux-actions';
import {$get, $set, $override} from 'plow-js';

const SET_POSITION = '@neos/neos-ui/GUEST/EditorToolbar/SET_POSITION';
const SHOW = '@neos/neos-ui/GUEST/EditorToolbar/SHOW';
const HIDE = '@neos/neos-ui/GUEST/EditorToolbar/HIDE';
const SET_CONFIGURATION = '@neos/neos-ui/GUEST/EditorToolbar/SET_CONFIGURATION';
const DISPATCH_SIGNAL = '@neos/neos-ui/GUEST/EditorToolbar/DISPATCH_SIGNAL';

//
// Export the action types
//
export const actionTypes = {
    SET_POSITION,
    SHOW,
    HIDE,
    SET_CONFIGURATION,
    DISPATCH_SIGNAL
};

const setPosition = createAction(SET_POSITION, (x, y) => ({x, y}));
const show = createAction(SHOW, editorName => ({editorName}));
const hide = createAction(HIDE);
const setConfiguration = createAction(SET_CONFIGURATION, configuration => ({configuration}));
const dispatchSignal = createAction(DISPATCH_SIGNAL, signal => signal);

//
// Export the actions
//
export const actions = {
    setPosition,
    show,
    hide,
    setConfiguration,
    dispatchSignal
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
    [SET_POSITION]: ({x, y}) => $override('editorToolbar', {x, y}),
    [SHOW]: ({editorName}) => state => $override('editorToolbar', {
        isVisible: $get('editorToolbar.configuration.components', state).some(
            $get('isEnabled')
        ),
        editorName
    }, state),
    [HIDE]: () => $override('editorToolbar', {
        isVisible: false,
        editorName: ''
    }),
    [SET_CONFIGURATION]: ({configuration}) => $set('editorToolbar.configuration', configuration)
};
