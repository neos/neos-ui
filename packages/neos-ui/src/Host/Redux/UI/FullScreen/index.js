import {createAction} from 'redux-actions';
import {Map} from 'immutable';
import {$set, $toggle} from 'plow-js';

import {handleActions} from '@neos-project/utils-redux';
import {actionTypes as system} from 'Host/Redux/System/index';

const TOGGLE = '@neos/neos-ui/UI/FullScreen/TOGGLE';

/**
 * Toggles the fullscreen mode on/off.
 */
const toggle = createAction(TOGGLE);

//
// Export the actions
//
export const actions = {
    toggle
};

//
// Export the reducer
//
export const reducer = handleActions({
    [system.INIT]: () => $set(
        'ui.fullScreen',
        new Map({
            isFullScreen: false
        })
    ),
    [TOGGLE]: () => $toggle('ui.fullScreen.isFullScreen')
});

//
// Export the selectors
//
export const selectors = {};
