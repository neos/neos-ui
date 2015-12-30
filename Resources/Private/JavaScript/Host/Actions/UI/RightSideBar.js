import {ActionTypes} from '../../Constants/';

export function toggleSideBar() {
    return {
        type: ActionTypes.UI.TOGGLE_RIGHT_SIDEBAR
    };
}
