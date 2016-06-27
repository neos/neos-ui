import {createAction} from 'redux-actions';
import {$set, $override} from 'plow-js';

const SET_POSITION = '@neos/neos-ui/GUEST/NodeToolbar/SET_POSITION';
const SHOW = '@neos/neos-ui/GUEST/NodeToolbar/SHOW';
const HIDE = '@neos/neos-ui/GUEST/NodeToolbar/HIDE';

//
// Export the action types
//
export const actionTypes = {
    SET_POSITION,
    SHOW,
    HIDE
};

const setPosition = createAction(SET_POSITION, (x, y) => ({x, y}));
const show = createAction(SHOW);
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
    isVisible: false
};

//
// Export the reducer
//
export const reducer = {
    [SET_POSITION]: ({x, y}) => $override('nodeToolbar', {x, y}),
    [SHOW]: () => $set('nodeToolbar.isVisible', true),
    [HIDE]: () => $set('nodeToolbar.isVisible', false)
};
