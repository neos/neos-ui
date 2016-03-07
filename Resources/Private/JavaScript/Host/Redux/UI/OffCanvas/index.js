import {createAction} from 'redux-actions';
import {$toggle, $set} from 'plow-js';

const TOGGLE = '@packagefactory/guevara/UI/OffCanvas/TOGGLE';
const HIDE = '@packagefactory/guevara/UI/OffCanvas/HIDE';

/**
 * Toggles the off canvas menu out/in of the users viewport.
 */
const toggle = createAction(TOGGLE);

/**
 * Hides the off canvas menu.
 */
const hide = createAction(HIDE);

//
// Export the actions
//
export const actions = {
    toggle,
    hide
};

//
// Export the initial state
//
export const initialState = {
    isHidden: true
};

//
// Export the reducer
//
export const reducer = {
    [TOGGLE]: () => $toggle('ui.offCanvas.isHidden'),
    [HIDE]: () => $set('ui.offCanvas.isHidden', true)
};
