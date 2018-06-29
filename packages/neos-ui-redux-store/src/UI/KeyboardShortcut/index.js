import {createAction} from 'redux-actions';
import Immutable from 'immutable';
import {$get, $set} from 'plow-js';

import {handleActions} from '@neos-project/utils-redux';
import {actionTypes as system} from '../../System/index';

const OPEN = '@neos/neos-ui/UI/KeyboardShortcut/OPEN';
const CLOSE = '@neos/neos-ui/UI/KeyboardShortcut/CLOSE';

//
// Export the action types
//
export const actionTypes = {
    OPEN,
    CLOSE
};

/**
 * Opens the KeyboardShortcut Modal
 */
const open = createAction(OPEN);

/**
 * Closes the KeyboardShortcut Modal
 */
const close = createAction(CLOSE);

//
// Export the actions
//
export const actions = {
    open,
    close
};

//
// Export the reducer
//
export const reducer = handleActions({
    [system.INIT]: payload => $set(
        'ui.keyboardShortcut',
        Immutable.fromJS($get('ui.keyboardShortcut', payload) ? $get('ui.keyboardShortcut', payload) : {isOpen: false})
    ),
    [OPEN]: () => $set('ui.keyboardShortcut.isOpen', true),
    [CLOSE]: () => $set('ui.keyboardShortcut.isOpen', false)
});

//
// Export the selectors
//
export const selectors = {};
