import Immutable from 'immutable';
import {immutableOperations} from 'Shared/Util/';
import {createAction, handleActions} from 'redux-actions';

const {$get, $set} = immutableOperations;

const TOGGLE_AUTO_PUBLISHING = '@packagefactory/guevara/User/Settings/TOGGLE_AUTO_PUBLISHING';
const initialState = Immutable.fromJS({
    isAutoPublishingEnabled: false
});

export default handleActions({
    [TOGGLE_AUTO_PUBLISHING]: state => {
        const isCurrentlyEnabled = $get(state, 'isAutoPublishingEnabled');

        return $set(state, 'isAutoPublishingEnabled', !isCurrentlyEnabled);
    }
}, initialState);

/**
 * Toggles the auto publishing mode for the current logged in user.
 */
export const toggleAutoPublishing = createAction(TOGGLE_AUTO_PUBLISHING);
