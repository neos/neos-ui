import {ActionTypes} from '../../Constants/';

/**
 * Toggles the left sidebar out/in of the users viewport.
 */
export function toggleSideBar() {
    return {
        type: ActionTypes.UI.TOGGLE_LEFT_SIDEBAR
    };
}
