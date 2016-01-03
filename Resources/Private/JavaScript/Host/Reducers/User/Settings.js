import {ActionTypes} from '../../Constants/';
import {immutableOperations} from '../../../Shared/Util/';

const {$get, $set} = immutableOperations;

export default {
    [ActionTypes.User.TOGGLE_AUTO_PUBLISHING](state) {
        const isCurrentlyEnabled = $get(state, 'user.settings.isAutoPublishingEnabled');

        return $set(state, 'user.settings.isAutoPublishingEnabled', !isCurrentlyEnabled);
    }
};
