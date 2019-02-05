import {createAction} from 'redux-actions';
import {$get, $set} from 'plow-js';

import {handleActions} from '@neos-project/utils-redux';
import {actionTypes as system} from '../../System/index';
import {fromJSOrdered} from '@neos-project/utils-helpers';

const OPEN = '@neos/neos-ui/UI/KeyboardShortcutModal/OPEN';
const CLOSE = '@neos/neos-ui/UI/KeyboardShortcutModal/CLOSE';

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
        'ui.keyboardShortcutModal',
        fromJSOrdered($get('ui.keyboardShortcutModal', payload) ? $get('ui.keyboardShortcutModal', payload) : {isOpen: false})
    ),
    [OPEN]: () => $set('ui.keyboardShortcutModal.isOpen', true),
    [CLOSE]: () => $set('ui.keyboardShortcutModal.isOpen', false)
});

//
// Export the selectors
//
export const selectors = {};
