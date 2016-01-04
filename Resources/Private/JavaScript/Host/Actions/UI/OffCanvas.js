import {ActionTypes} from '../../Constants/';

/**
 * Toggles the off canvas menu out/in of the users viewport.
 */
export function toggleOffCanvas() {
    return {
        type: ActionTypes.UI.TOGGLE_OFF_CANVAS
    };
}

/**
 * Hides the off canvas menu.
 * @return {Object} [description]
 */
export function hideOffCanvas() {
    return {
        type: ActionTypes.UI.HIDE_OFF_CANVAS
    };
}
