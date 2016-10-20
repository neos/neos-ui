import {createAction} from 'redux-actions';
import Immutable, {Map} from 'immutable';
import {$set, $drop} from 'plow-js';

import {handleActions} from '@neos-project/utils-redux';
import {actionTypes as system} from 'Host/Redux/System/index';

const ADD = '@neos/neos-ui/UI/FlashMessages/ADD';
const REMOVE = '@neos/neos-ui/UI/FlashMessages/REMOVE';

/**
 * Adds a flash message
 *
 * @param {String} id       Must be unique within the ui.flashMessages portion of the store
 * @param {String} message  The message which will be displayed to in the UI.
 * @param {String} severity
 * @param {Integer} timeout An (optional) timeout, after which the flash message will disappear
 * @return {Object}
 */
const add = createAction(ADD, (id, message, severity = '', timeout = 0) => ({
    severity,
    id,
    message,
    timeout
}));

/**
 * Removes a flash message
 *
 * @param  {String} id The flashMessage id to delete.
 */
const remove = createAction(REMOVE, id => ({
    id
}));

//
// Export the actions
//
export const actions = {
    add,
    remove
};

//
// Export the reducer
//
export const reducer = handleActions({
    [system.INIT]: () => $set(
        'ui.flashMessages',
        new Map()
    ),
    [ADD]: message => state => {
        const allowedSeverities = ['success', 'error', 'info'];
        const {id, severity} = message;
        const messageContents = message.message;

        if (!id || id.length < 0) {
            throw new Error('Empty or non existent "id" passed to the addFlashMessage reducer. Please specify a string containing a random id.');
        }

        if (!messageContents || messageContents.length < 0) {
            throw new Error('Empty or non existent "message" passed to the addFlashMessage reducer. Please specify a string containing your desired message.');
        }

        if (!severity || allowedSeverities.indexOf(severity.toLowerCase()) < 0) {
            throw new Error(`Invalid "severity" specified while adding a new FlashMessage. Allowed severities are ${allowedSeverities.join(' ')}.`);
        }

        //
        // Lowercase the severitiy because we need a consistent format in the FlashMessages container.
        //
        message.severity = message.severity.toLowerCase();

        return $set(['ui', 'flashMessages', message.id], Immutable.fromJS(message), state);
    },
    [REMOVE]: ({id}) => $drop(['ui', 'flashMessages', id])
});

//
// Export the selectors
//
export const selectors = {};
