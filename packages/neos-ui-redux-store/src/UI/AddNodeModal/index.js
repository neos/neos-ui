import {createAction} from 'redux-actions';
import {Map} from 'immutable';
import {$all, $get, $set, $toggle} from 'plow-js';

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
 *
 * @param {String} contextPath ContextPath of the node relative to which the new node ought to be created
 * @param {Object} fusionPath (optional) fusion path of the rendered node relative to which the new node ought to be
 *                            positioned.
 */
const open = createAction(OPEN, (contextPath, fusionPath = '') => ({contextPath, fusionPath}));

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
    ERROR_INVALID_CONTEXTPATH: 'Context path of reference node must be of type string.',
    ERROR_INVALID_FUSIONPATH: 'Fusion path of reference node must be of type string.'
};

//
// Export the reducer
//
export const reducer = handleActions({
    [system.INIT]: state => $set(
        'ui.addNodeModal',
        new Map({
            contextPath: '',
            fusionPath: '',
            collapsedGroups: $get('ui.addNodeModal.collapsedGroups', state) ? $get('ui.addNodeModal.collapsedGroups', state) : []
        })
    ),
    [OPEN]: ({contextPath, fusionPath}) => {
        if (typeof contextPath !== 'string') {
            throw new Error(errorMessages.ERROR_INVALID_CONTEXTPATH);
        }
        if (typeof fusionPath !== 'string') {
            throw new Error(errorMessages.ERROR_INVALID_FUSIONPATH);
        }

        return $all(
            $set('ui.addNodeModal.contextPath', contextPath),
            $set('ui.addNodeModal.fusionPath', fusionPath)
        );
    },
    [CLOSE]: () => $all(
        $set('ui.addNodeModal.contextPath', ''),
        $set('ui.addNodeModal.fusionPath', '')
    ),
    [TOGGLE_GROUP]: groupId => $toggle('ui.addNodeModal.collapsedGroups', groupId)
});

//
// Export the selectors
//
export {selectors};
