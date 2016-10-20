import {createAction} from 'redux-actions';
import {Map} from 'immutable';
import {$toggle, $set} from 'plow-js';

import {handleActions} from '@neos-project/utils-redux';
import {actionTypes as system} from 'Host/Redux/System/index';

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
// Export the reducer
//
export const reducer = handleActions({
    [system.INIT]: () => $set(
        'ui.drawer',
        new Map({
            isHidden: true
        })
    ),
    [TOGGLE]: () => $toggle('ui.drawer.isHidden'),
    [HIDE]: () => $set('ui.drawer.isHidden', true)
});

//
// Export the selectors
//
export const selectors = {};
