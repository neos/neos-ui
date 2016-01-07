import {immutableOperations} from 'Shared/Util/';

const {$get, $set} = immutableOperations;

const TOGGLE = '@packagefactory/guevara/UI/RightSidebar/TOGGLE';

export default function reducer(state, action) {
    switch (action.type) {
        case TOGGLE:
            const isCurrentlyHidden = $get(state, 'ui.rightSidebar.isHidden');

            return $set(state, 'ui.rightSidebar.isHidden', !isCurrentlyHidden);

        default: return state;

    }
}

/**
 * Toggles the right sidebar out/in of the users viewport.
 *
 * @return {Object}
 */
export function toggle() {
    return {
        type: TOGGLE
    };
}
