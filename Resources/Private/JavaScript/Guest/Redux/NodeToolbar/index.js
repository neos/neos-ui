import {createAction} from 'redux-actions';
import {$set, $override} from 'plow-js';

const SET_POSITION = '@neos/neos-ui/GUEST/NodeToolbar/SET_POSITION';
const SET_NODE = '@neos/neos-ui/GUEST/NodeToolbar/SET_NODE';
const SHOW = '@neos/neos-ui/GUEST/NodeToolbar/SHOW';
const HIDE = '@neos/neos-ui/GUEST/NodeToolbar/HIDE';

//
// Export the action types
//
export const actionTypes = {
    SET_POSITION,
    SET_NODE,
    SHOW,
    HIDE
};

const setPosition = createAction(SET_POSITION, (x, y) => ({x, y}));
const setNode = createAction(SET_NODE, node => node);
const show = createAction(SHOW);
const hide = createAction(HIDE);

//
// Export the actions
//
export const actions = {
    setPosition,
    setNode,
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
    node: null
};

//
// Export the reducer
//
export const reducer = {
    [SET_POSITION]: ({x, y}) => $override('nodeToolbar', {x, y}),
    [SET_NODE]: node => $set('nodeToolbar.node', node),
    [SHOW]: () => $set('nodeToolbar.isVisible', true),
    [HIDE]: () => $set('nodeToolbar.isVisible', false)
};
