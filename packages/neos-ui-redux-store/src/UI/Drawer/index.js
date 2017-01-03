import {createAction} from 'redux-actions';
import Immutable from 'immutable';
import {$toggle, $get, $set} from 'plow-js';

import {handleActions} from '@neos-project/utils-redux';

import {actionTypes as system} from '../../System/index';

const TOGGLE = '@neos/neos-ui/UI/Drawer/TOGGLE';
const HIDE = '@neos/neos-ui/UI/Drawer/HIDE';

//
// Export the action types
//
export const actionTypes = {
    TOGGLE,
    HIDE
};

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
    [system.INIT]: payload => $set(
        'ui.drawer',
        Immutable.fromJS($get('ui.drawer', payload) ? $get('ui.drawer', payload) : {isHidden: true})
    ),
    [TOGGLE]: () => $toggle('ui.drawer.isHidden'),
    [HIDE]: () => $set('ui.drawer.isHidden', true)
});

//
// Export the selectors
//
export const selectors = {};
