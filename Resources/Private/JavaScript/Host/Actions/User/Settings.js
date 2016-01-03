import {ActionTypes} from '../../Constants/';

/**
 * Toggles the left sidebar out/in of the users viewport.
 */
export function toggleAutoPublishing() {
    return {
        type: ActionTypes.User.TOGGLE_AUTO_PUBLISHING
    };
}
