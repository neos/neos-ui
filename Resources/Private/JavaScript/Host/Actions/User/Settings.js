import {ActionTypes} from '../../Constants/';

/**
 * Toggles the auto publishing mode for the current logged in user.
 */
export function toggleAutoPublishing() {
    return {
        type: ActionTypes.User.TOGGLE_AUTO_PUBLISHING
    };
}
