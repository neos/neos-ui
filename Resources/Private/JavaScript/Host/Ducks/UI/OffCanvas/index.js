import {immutableOperations} from 'Shared/Util/';

const {$get, $set} = immutableOperations;

const TOGGLE = '@packagefactory/guevara/UI/OffCanvas/TOGGLE';
const HIDE = '@packagefactory/guevara/UI/OffCanvas/HIDE';

export default function reducer (state, action) {
    switch(action.type) {

        case TOGGLE:
            const isCurrentlyHidden = $get(state, 'ui.offCanvas.isHidden');

            return $set(state, 'ui.offCanvas.isHidden', !isCurrentlyHidden);

        case HIDE:
            return $set(state, 'ui.offCanvas.isHidden', true);

        default: return state;

    }
}

/**
 * Toggles the off canvas menu out/in of the users viewport.
 *
 * @return {Object}
 */
export function toggle() {
    return {
        type: TOGGLE
    };
}

/**
 * Hides the off canvas menu.
 *
 * @return {Object}
 */
export function hide() {
    return {
        type: HIDE
    };
}
