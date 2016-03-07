import {createAction} from 'redux-actions';
import {$add, $set} from 'plow-js';

const ADD = '@packagefactory/guevara/Transient/Changes/ADD';
const FLUSH = '@packagefactory/guevara/Transient/Changes/FLUSH';
const CLEAR = '@packagefactory/guevara/Transient/Changes/CLEAR';

//
// Export the action types
//
export const actionTypes = {
    ADD,
    FLUSH,
    CLEAR
};

/**
 * Adds the given chagnge to the global state.
 * If you want to add a change, use the the ChangeManager API.
 */
const add = createAction(ADD, change => ({change}));

/**
 * Sends all local changes to the server.
 */
const flush = createAction(FLUSH);

/**
 * Clears all local changes from the global state.
 * If you want to flush the changes, use the ChangeManager API.
 */
const clear = createAction(CLEAR);

//
// Export the actions
//
export const actions = {
    add,
    flush,
    clear
};

//
// Export the initial state
//
export const initialState = [];

//
// Export the reducer
//
export const reducer = {
    [ADD]: ({change}) => $add('changes', change),
    [CLEAR]: () => $set('changes', initialState)
};
