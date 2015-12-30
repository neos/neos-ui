import {ActionTypes} from '../../Constants/';

/**
 * Toggles the right sidebar out/in of the users viewport.
 */
export function toggleSideBar() {
    return {
        type: ActionTypes.UI.TOGGLE_RIGHT_SIDEBAR
    };
}
