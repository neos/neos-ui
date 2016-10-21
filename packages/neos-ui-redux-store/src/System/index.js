import {createAction} from 'redux-actions';

import {handleActions} from '@neos-project/utils-redux';

const BOOT = '@neos/neos-ui/System/BOOT';
const INIT = '@neos/neos-ui/System/INIT';
const READY = '@neos/neos-ui/System/READY';

//
// Export the action types
//
export const actionTypes = {
    BOOT,
    INIT,
    READY
};

const boot = createAction(BOOT);
const init = createAction(INIT, state => state);
const ready = createAction(READY);

//
// Export the actions
//
export const actions = {
    boot,
    init,
    ready
};

//
// Export the reducer
//
export const reducer = handleActions({
});

//
// Export the selectors
//
export const selectors = {};
