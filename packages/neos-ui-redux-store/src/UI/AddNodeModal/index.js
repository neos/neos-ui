import {createAction} from 'redux-actions';
import Immutable, {Map} from 'immutable';
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
 *
 * @param {String} contextPath ContextPath of the node relative to which the new node ought to be created
 * @param {String} mode The insertion mode (append|prepend|insert)
 * @param {Object} domContext A map of dom addresses (contextPath, fusionPath), needed to place the resulting node
 *                            into the correct place in the DOM. Example:
 *                            {
 *                                parentDomAddress: {
 *                                    contextPath: '/sites/...',
 *                                    fusionPath: '/root/...'
 *                                },
 *                                nextSiblingDomAddress: {
 *                                    contextPath: '/sites/...',
 *                                    fusionPath: '/root/...'
 *                                }
 *                            }
 */
const open = createAction(OPEN, (contextPath, mode, domContext) => ({contextPath, mode, domContext}));

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
    ERROR_INVALID_DOMCONTEXT: 'Received malformed reference: A key `subject` was expected but not found.',
    ERROR_INVALID_CONTEXTPATH: 'Context path of subject reference node must be of type string.',
    ERROR_INVALID_MODE: 'Provided mode is not within allowed modes list in AddNodeModal.'
};

//
// Export the reducer
//
export const reducer = handleActions({
    [system.INIT]: () => $set(
        'ui.addNodeModal',
        new Map({
            contextPath: '',
            mode: 'insert',
            domContext: null,
            collapsedGroups: []
        })
    ),
    [OPEN]: ({contextPath, mode, domContext}) => {
        if (typeof contextPath !== 'string') {
            throw new Error(errorMessages.ERROR_INVALID_CONTEXTPATH);
        }
        const allowedModes = ['insert', 'append', 'prepend'];
        if (allowedModes.indexOf(mode) === -1) {
            throw new Error(errorMessages.ERROR_INVALID_MODE);
        }

        return $all(
            $set('ui.addNodeModal.contextPath', contextPath),
            $set('ui.addNodeModal.mode', mode),
            $set('ui.addNodeModal.domContext', Immutable.fromJS(domContext))
        );
    },
    [CLOSE]: () => $all(
        $set('ui.addNodeModal.contextPath', ''),
        $set('ui.addNodeModal.domContext', null)
    ),
    [TOGGLE_GROUP]: groupId => $toggle('ui.addNodeModal.collapsedGroups', groupId)
});

//
// Export the selectors
//
export {selectors};
