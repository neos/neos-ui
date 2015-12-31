import {ActionTypes} from '../../Constants/';

export function add(id, message, severity, timeout = 0) {
    return {
        type: ActionTypes.UI.ADD_FLASH_MESSAGE,
        id,
        message,
        severity,
        timeout
    };
}

export function remove(id) {
    return {
        type: ActionTypes.UI.REMOVE_FLASH_MESSAGE,
        id
    };
}
