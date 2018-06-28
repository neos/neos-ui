import {createAction} from 'redux-actions';
import Immutable from 'immutable';
import {$get, $set, $toggle} from 'plow-js';

import {handleActions} from '@neos-project/utils-redux';
import {actionTypes as system} from '../../System/index';

const TOGGLE = '@neos/neos-ui/UI/KeyboardShortcut/TOGGLE';

//
// Export the action types
//
export const actionTypes = {
    TOGGLE
};

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
// Export the reducer
//
export const reducer = handleActions({
    [system.INIT]: payload => $set(
        'ui.keyboardShortcut',
        Immutable.fromJS($get('ui.keyboardShortcut', payload) ? $get('ui.keyboardShortcut', payload) : {isOpen: false})
    ),
    [TOGGLE]: () => $toggle('ui.keyboardShortcut.isOpen')
});

//
// Export the selectors
//
export const selectors = {};
