import {immutableOperations} from 'Shared/Util/';

const {$get, $set} = immutableOperations;

const TOGGLE_AUTO_PUBLISHING = '@packagefactory/guevara/User/Settings/TOGGLE_AUTO_PUBLISHING';

export default function reducer(state, action) {
    switch (action.type) {
        case TOGGLE_AUTO_PUBLISHING:
            const isCurrentlyEnabled = $get(state, 'user.settings.isAutoPublishingEnabled');

            return $set(state, 'user.settings.isAutoPublishingEnabled', !isCurrentlyEnabled);

        default: return state;

    }
}

/**
 * Toggles the auto publishing mode for the current logged in user.
 *
 * @return {Object}
 */
export function toggleAutoPublishing() {
    return {
        type: TOGGLE_AUTO_PUBLISHING
    };
}
