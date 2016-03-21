import {createAction} from 'redux-actions';

const PERSIST = '@packagefactory/guevara/Transient/Changes/PERSIST';

//
// Export the action types
//
export const actionTypes = {
    PERSIST
};

/**
 * Perists the change.
 */
const persistChange = createAction(PERSIST, change => ({change}));

//
// Export the actions
//
export const actions = {
    persistChange
};

//
// Export the initial state
//
export const initialState = {};

//
// Export the reducer
//
export const reducer = {};
