import {createAction} from 'redux-actions';
import {Map} from 'immutable';
import {$all, $set, $toggle} from 'plow-js';

import {handleActions} from '@neos-project/utils-redux';
import {actionTypes as system} from '../../System/index';

import * as selectors from './selectors';

const OPEN = '@neos/neos-ui/UI/AddNodeModal/OPEN';
const CLOSE = '@neos/neos-ui/UI/AddNodeModal/CLOSE';
const TOGGLE_GROUP = '@neos/neos-ui/UI/AddNodeModal/TOGGLE_GROUP';

//
// Export the action types
//
export const actionTypes = {
    OPEN,
    CLOSE,
    TOGGLE_GROUP
};

/**
 * Opens the add node modal.
 */
const open = createAction(OPEN, (contextPath, mode) => ({contextPath, mode}));

/**
 * Closes the add node modal.
 */
const close = createAction(CLOSE);

/**
 * Toggles the nodetype group.
 */
const toggleGroup = createAction(TOGGLE_GROUP);

//
// Export the actions
//
export const actions = {
    open,
    close,
    toggleGroup
};

//
// Export error messages for testing
//
export const errorMessages = {
    ERROR_INVALID_CONTEXTPATH: 'contextPath of reference node must be of type string.',
    ERROR_INVALID_MODE: 'Provided mode is not within allowed modes list in AddNodeModal.'
};

//
// Export the reducer
//
export const reducer = handleActions({
    [system.INIT]: () => $set(
        'ui.addNodeModal',
        new Map({
            referenceNode: '',
            mode: 'insert',
            collapsedGroups: []
        })
    ),
    [OPEN]: ({contextPath, mode}) => {
        if (typeof contextPath !== 'string') {
            throw new Error(errorMessages.ERROR_INVALID_CONTEXTPATH);
        }
        const allowedModes = ['insert', 'append', 'prepend'];
        if (allowedModes.indexOf(mode) === -1) {
            throw new Error(errorMessages.ERROR_INVALID_MODE);
        }
        return $all(
            $set('ui.addNodeModal.referenceNode', contextPath),
            $set('ui.addNodeModal.mode', mode)
        );
    },
    [CLOSE]: () => $set('ui.addNodeModal.referenceNode', ''),
    [TOGGLE_GROUP]: groupId => $toggle('ui.addNodeModal.collapsedGroups', groupId)
});

//
// Export the selectors
//
export {selectors};
