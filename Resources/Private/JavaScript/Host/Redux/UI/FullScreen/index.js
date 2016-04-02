import {createAction} from 'redux-actions';
import {Map} from 'immutable';
import {$set, $toggle} from 'plow-js';

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
// Export the initial state hydrator
//
export const hydrate = () => $set(
    'ui.fullScreen',
    new Map({
        isFullScreen: false
    })
);

//
// Export the reducer
//
export const reducer = {
    [TOGGLE]: () => $toggle('ui.fullScreen.isFullScreen')
};
