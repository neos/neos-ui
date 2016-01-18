import {immutableOperations} from 'Shared/Util/';
import {createAction, handleActions} from 'redux-actions';

const {$get, $set} = immutableOperations;

const TOGGLE_AUTO_PUBLISHING = '@packagefactory/guevara/User/Settings/TOGGLE_AUTO_PUBLISHING';
const initialState = {
    isAutoPublishingEnabled: false
};

export default handleActions({
    [TOGGLE_AUTO_PUBLISHING]: state => {
        const isCurrentlyEnabled = $get(state, 'user.settings.isAutoPublishingEnabled');

        return $set(state, 'user.settings.isAutoPublishingEnabled', !isCurrentlyEnabled);
    }
}, initialState);

/**
 * Toggles the auto publishing mode for the current logged in user.
 */
export const toggleAutoPublishing = createAction(TOGGLE_AUTO_PUBLISHING);
