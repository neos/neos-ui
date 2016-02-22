import {createAction} from 'redux-actions';
import {$add, $drop} from 'plow-js';

const ADD = '@packagefactory/guevara/UI/FlashMessages/ADD';
const REMOVE = '@packagefactory/guevara/UI/FlashMessages/REMOVE';

/**
 * Adds a flash message
 *
 * @param {String} id       Must be unique within the ui.flashMessages portion of the store
 * @param {String} message  The message which will be displayed to in the UI.
 * @param {String} severity
 * @param {Integer} timeout An (optional) timeout, after which the flash message will disappear
 * @return {Object}
 */
const add = createAction(ADD, (id, message, severity, timeout = 0) => ({
    severity: severity.toLowerCase(),
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
// Export the initial state
//
export const initialState = {};

//
// Export the reducer
//
export const reducer = {
    [ADD]: message => $add(`ui.flashMessages`, {[message.id]: message}),
    [REMOVE]: message => $drop(['ui', 'flashMessages', message.id])
};
