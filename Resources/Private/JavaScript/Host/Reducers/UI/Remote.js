import {ActionTypes} from '../../Constants/';
import {immutableOperations} from '../../../Shared/Util/';

const {$set} = immutableOperations;

export default {
    [ActionTypes.UI.REMOTE_SAVING_START](state, action) {
        return $set(state, 'ui.remote.isSaving', true);
    },

    [ActionTypes.UI.REMOTE_SAVING_FINISH](state, action) {
        return $set(state, 'ui.remote.isSaving', false);
    },

    [ActionTypes.UI.REMOTE_PUBLISHING_START](state, action) {
        return $set(state, 'ui.remote.isPublishing', true);
    },

    [ActionTypes.UI.REMOTE_PUBLISHING_FINISH](state, action) {
        return $set(state, 'ui.remote.isPublishing', false);
    },

    [ActionTypes.UI.REMOTE_DISCARDING_START](state, action) {
        return $set(state, 'ui.remote.isDiscarding', true);
    },

    [ActionTypes.UI.REMOTE_DISCARDING_FINISH](state, action) {
        return $set(state, 'ui.remote.isDiscarding', false);
    }
};
