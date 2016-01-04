import {immutableOperations} from '../../../Shared/Util/';

const {$set,$delete} = immutableOperations;

const ADD = '@packagefactory/guevara/UI/FlashMessages/ADD';
const REMOVE = '@packagefactory/guevara/UI/FlashMessages/REMOVE';

export default function reducer (state, action) {
    switch(action.type) {

        case ADD:
            const {id, message, severity, timeout} = action;
            return $set(state, `ui.flashMessages.${id}`, {
                id,
                message,
                severity,
                timeout
            });

        case REMOVE:
            return $delete(state, `ui.flashMessages.${action.id}`);

        default: return state;

    }
}

/**
 * Adds a flash message
 *
 * @param {String} id       must be unique within the ui.flashMessages portion of the store
 * @param {String} message
 * @param {String} severity
 * @param {Integer} timeout An (optional) timeout, after which the flash message will disappear
 * @return {Object}
 */
export function add(id, message, severity, timeout = 0) {
    return {
        type: ADD,
        id,
        message,
        severity,
        timeout
    };
}

/**
 * Removes a flash message
 *
 * @param  {String} id
 * @return {Object}
 */
export function remove(id) {
    return {
        type: REMOVE,
        id
    };
}
