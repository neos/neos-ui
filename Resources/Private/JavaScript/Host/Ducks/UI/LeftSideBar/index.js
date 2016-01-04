import {immutableOperations} from '../../../../Shared/Util/';

const {$get, $set} = immutableOperations;

const TOGGLE = '@packagefactory/guevara/UI/LeftSideBar/TOGGLE';

export default function reducer (state, action) {
    switch (action.type) {

        case TOGGLE:
            const isCurrentlyHidden = $get(state, 'ui.leftSidebar.isHidden');

            return $set(state, 'ui.leftSidebar.isHidden', !isCurrentlyHidden);

        default: return state;

    }

}

/**
 * Toggles the left sidebar out/in of the users viewport.
 *
 * @return {Object}
 */
export function toggle() {
    return {
        type: TOGGLE
    };
}
