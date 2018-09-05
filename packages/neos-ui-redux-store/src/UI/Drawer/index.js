import {createAction} from 'redux-actions';
import {Map} from 'immutable';
import {$toggle, $get, $set} from 'plow-js';

import {handleActions} from '@neos-project/utils-redux';

import {actionTypes as system} from '../../System/index';

const TOGGLE = '@neos/neos-ui/UI/Drawer/TOGGLE';
const HIDE = '@neos/neos-ui/UI/Drawer/HIDE';
const TOGGLE_MENU_GROUP = '@neos/neos-ui/UI/Drawer/TOGGLE_MENU_GROUP';

//
// Export the action types
//
export const actionTypes = {
    TOGGLE,
    HIDE,
    TOGGLE_MENU_GROUP
};

/**
 * Toggles the off canvas menu out/in of the users viewport.
 */
const toggle = createAction(TOGGLE);

/**
 * Hides the off canvas menu.
 */
const hide = createAction(HIDE);

/**
 * Toggles collapsed state of a menu group.
 */
const toggleMenuGroup = createAction(TOGGLE_MENU_GROUP, menuGroup => ({menuGroup}));

//
// Export the actions
//
export const actions = {
    toggle,
    hide,
    toggleMenuGroup
};

//
// Export the reducer
//
export const reducer = handleActions({
    [system.INIT]: state => $set(
        'ui.drawer',
        new Map({
            isHidden: $get('ui.drawer.isHidden', state) ? $get('ui.drawer.isHidden', state) : false,
            collapsedMenuGroups: $get('ui.drawer.collapsedMenuGroups', state) ? $get('ui.drawer.collapsedMenuGroups', state) : ['content']
        })
    ),
    [TOGGLE]: () => $toggle('ui.drawer.isHidden'),
    [HIDE]: () => $set('ui.drawer.isHidden', true),
    [TOGGLE_MENU_GROUP]: ({menuGroup}) => $toggle('ui.drawer.collapsedMenuGroups', menuGroup)
});

//
// Export the selectors
//
export const selectors = {};
