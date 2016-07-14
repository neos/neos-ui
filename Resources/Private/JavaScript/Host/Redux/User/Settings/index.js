import {createAction} from 'redux-actions';
import {Map} from 'immutable';
import {$set, $toggle} from 'plow-js';

import {handleActions} from 'Shared/Utilities/index';
import {actionTypes as system} from 'Host/Redux/System/index';

const TOGGLE_AUTO_PUBLISHING = '@neos/neos-ui/User/Settings/TOGGLE_AUTO_PUBLISHING';

/**
 * Toggles the auto publishing mode for the current logged in user.
 */
const toggleAutoPublishing = createAction(TOGGLE_AUTO_PUBLISHING);

//
// Export the actions
//
export const actions = {
    toggleAutoPublishing
};

//
// Export the reducer
//
export const reducer = handleActions({
    [system.INIT]: () => $set(
        'user.settings',
        new Map({
            isAutoPublishingEnabled: false
        })
    ),
    [TOGGLE_AUTO_PUBLISHING]: () => $toggle('user.settings.isAutoPublishingEnabled')
});
