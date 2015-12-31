import {ActionTypes} from '../../Constants/';
import {immutableOperations} from '../../../Shared/Util/';

const {$set,$delete} = immutableOperations;

export default {
    [ActionTypes.UI.ADD_FLASH_MESSAGE](state, action) {
        const {id, message, severity, timeout} = action;
        return $set(state, `ui.flashMessages.${id}`, {
            id,
            message,
            severity,
            timeout
        });
    },

    [ActionTypes.UI.REMOVE_FLASH_MESSAGE](state, action) {
        return $delete(state, `ui.flashMessages.${action.id}`);
    },
};
