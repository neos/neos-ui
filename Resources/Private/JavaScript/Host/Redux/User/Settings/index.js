import {createAction} from 'redux-actions';
import {Map} from 'immutable';
import {$set, $toggle, $get} from 'plow-js';

import {handleActions} from 'Shared/Utilities/index';
import {actionTypes as system} from 'Host/Redux/System/index';

const TOGGLE_AUTO_PUBLISHING = '@neos/neos-ui/User/Settings/TOGGLE_AUTO_PUBLISHING';

export const actionTypes = {
    TOGGLE_AUTO_PUBLISHING
};

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
    [system.INIT]: state => $set(
        'user.settings',
        new Map({
            isAutoPublishingEnabled: Boolean($get('user.settings.isAutoPublishingEnabled', state))
        })
    ),
    [TOGGLE_AUTO_PUBLISHING]: () => $toggle('user.settings.isAutoPublishingEnabled')
});

//
// Export the selectors
//
export const selectors = {};
