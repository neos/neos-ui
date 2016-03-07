import {createAction} from 'redux-actions';
import {$toggle} from 'plow-js';

const TOGGLE = '@packagefactory/guevara/UI/FullScreen/TOGGLE';

/**
 * Toggles the fullscreen mode on/off.
 */
const toggle = createAction(TOGGLE);

//
// Export the actions
//
export const actions = {
    toggle
};

//
// Export the initial state
//
export const initialState = {
    isFullScreen: false
};

//
// Export the reducer
//
export const reducer = {
    [TOGGLE]: () => $toggle('ui.fullScreen.isFullScreen')
};
