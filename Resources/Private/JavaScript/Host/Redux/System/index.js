import {createAction} from 'redux-actions';

const BOOT = '@neos/neos-ui/System/BOOT';

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
// Export the reducer
//
export const reducer = {
};
