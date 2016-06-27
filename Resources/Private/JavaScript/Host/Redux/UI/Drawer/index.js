import {createAction} from 'redux-actions';
import {Map} from 'immutable';
import {$toggle, $set} from 'plow-js';

const TOGGLE = '@neos/neos-ui/UI/Drawer/TOGGLE';
const HIDE = '@neos/neos-ui/UI/Drawer/HIDE';

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
// Export the initial state hydrator
//
export const hydrate = () => $set(
    'ui.drawer',
    new Map({
        isHidden: true
    })
);

//
// Export the reducer
//
export const reducer = {
    [TOGGLE]: () => $toggle('ui.drawer.isHidden'),
    [HIDE]: () => $set('ui.drawer.isHidden', true)
};
