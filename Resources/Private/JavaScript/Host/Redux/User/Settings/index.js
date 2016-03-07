import {createAction} from 'redux-actions';
import {$toggle} from 'plow-js';

const TOGGLE_AUTO_PUBLISHING = '@packagefactory/guevara/User/Settings/TOGGLE_AUTO_PUBLISHING';

/**
 * Toggles the auto publishing mode for the current logged in user.
 */
const toggleAutoPublishing = createAction(TOGGLE_AUTO_PUBLISHING);

//
// Export the actions
//
export const actions = {
    toggleAutoPublishing
};

//
// Export the initial state
//
export const initialState = {
    isAutoPublishingEnabled: false
};

//
// Export the reducer
//
export const reducer = {
    [TOGGLE_AUTO_PUBLISHING]: () => $toggle('user.settings.isAutoPublishingEnabled')
};
