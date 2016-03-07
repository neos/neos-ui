import {createAction} from 'redux-actions';

const BOOT = '@packagefactory/guevara/System/BOOT';

//
// Export the action types
//
export const actionTypes = {
    BOOT
};

const boot = createAction(BOOT);

//
// Export the actions
//
export const actions = {
    boot
};

//
// Export the initial state
//
export const initialState = {};

//
// Export the reducer
//
export const reducer = {
};
