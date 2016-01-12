import {immutableOperations} from 'Shared/Util/';
import {createAction, handleActions} from 'redux-actions';

const {$get, $set} = immutableOperations;

const TOGGLE_AUTO_PUBLISHING = '@packagefactory/guevara/User/Settings/TOGGLE_AUTO_PUBLISHING';

export default handleActions({
    [TOGGLE_AUTO_PUBLISHING]: state => {
        const isCurrentlyEnabled = $get(state, 'user.settings.isAutoPublishingEnabled');

        return $set(state, 'user.settings.isAutoPublishingEnabled', !isCurrentlyEnabled);
    }
});

/**
 * Toggles the auto publishing mode for the current logged in user.
 */
export const toggleAutoPublishing = createAction(TOGGLE_AUTO_PUBLISHING);
