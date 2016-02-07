import Immutable from 'immutable';
import {createAction, handleActions} from 'redux-actions';

const ADD = '@packagefactory/guevara/Transient/Changes/ADD';
const CLEAR = '@packagefactory/guevara/Transient/Changes/CLEAR';

/**
 * Adds the given chagnge to the global state.
 * If you want to add a change, use the the ChangeManager API.
 */
const add = createAction(ADD, change => ({change}));

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
    clear
};

//
// Export the reducer
//
const initialState = Immutable.fromJS([]);

export const reducer = handleActions({
    [ADD]: (state, action) => state.push(action.payload.change),
    [CLEAR]: () => initialState
}, initialState);

//
// Export the event map
//
export const events = {
};
