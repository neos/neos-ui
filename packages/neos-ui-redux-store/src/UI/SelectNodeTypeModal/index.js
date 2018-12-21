import {createAction} from 'redux-actions';
import {Map} from 'immutable';
import {$set} from 'plow-js';

import {handleActions} from '@neos-project/utils-redux';
import {actionTypes as system} from '../../System/index';

const PREFERRED_MODE_DEFAULT = 'after';

const OPEN = '@neos/neos-ui/UI/SelectNodeTypeModal/OPEN';
const CANCEL = '@neos/neos-ui/UI/SelectNodeTypeModal/CANCEL';
const APPLY = '@neos/neos-ui/UI/SelectNodeTypeModal/APPLY';

//
// Export the action types
//
export const actionTypes = {
    OPEN,
    CANCEL,
    APPLY
};

/**
 * Opens the select nodetype modal.
 *
 * @param {string} referenceNodeContextPath ContextPath of the node relative to which the new node ought to be created
 * @param {string} preferredMode (optional) Allows to override the default insertion mode. Currently not used in the system, but useful for extensibility.
 */
const open = createAction(OPEN, (referenceNodeContextPath, preferredMode = PREFERRED_MODE_DEFAULT) => ({referenceNodeContextPath, preferredMode}));
const cancel = createAction(CANCEL);
const apply = createAction(APPLY, (mode, nodeType) => ({mode, nodeType}));

//
// Export the actions
//
export const actions = {
    open,
    cancel,
    apply
};

//
// Export the reducer
//
export const reducer = handleActions({
    [system.INIT]: () => $set(
        'ui.selectNodeTypeModal',
        new Map({
            isOpen: false,
            referenceNodeContextPath: '',
            preferredMode: PREFERRED_MODE_DEFAULT
        })
    ),
    [OPEN]: ({referenceNodeContextPath, preferredMode}) =>
        $set('ui.selectNodeTypeModal', new Map({
            isOpen: true,
            referenceNodeContextPath,
            preferredMode
        })),
    [CANCEL]: () => $set('ui.selectNodeTypeModal', new Map({
        isOpen: false,
        referenceNodeContextPath: '',
        preferredMode: PREFERRED_MODE_DEFAULT
    })),
    [APPLY]: () => $set('ui.selectNodeTypeModal', new Map({
        isOpen: false,
        referenceNodeContextPath: '',
        preferredMode: PREFERRED_MODE_DEFAULT
    }))
});
