import {immutableOperations} from 'Shared/Util/';
import {createAction, handleActions} from 'redux-actions';

const {$set, $delete} = immutableOperations;

const ADD = '@packagefactory/guevara/UI/FlashMessages/ADD';
const REMOVE = '@packagefactory/guevara/UI/FlashMessages/REMOVE';

export default handleActions({
    [ADD]: (state, action) => $set(state, `ui.flashMessages.${action.payload.id}`, action.payload),
    [REMOVE]: (state, action) => $delete(state, `ui.flashMessages.${action.payload.id}`)
});

/**
 * Adds a flash message
 *
 * @param {String} id       Must be unique within the ui.flashMessages portion of the store
 * @param {String} message  The message which will be displayed to in the UI.
 * @param {String} severity
 * @param {Integer} timeout An (optional) timeout, after which the flash message will disappear
 * @return {Object}
 */
export const add = createAction(REMOVE, (id, message, severity, timeout = 0) => {
    return {
        severity: severity.toLowerCase(),
        id,
        message,
        timeout
    };
});

/**
 * Removes a flash message
 *
 * @param  {String} id The flashMessage id to delete.
 */
export const remove = createAction(REMOVE, id => id);
