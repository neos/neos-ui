import {createAction} from 'redux-actions';
import Immutable from 'immutable';
import {$get, $set, $toggle} from 'plow-js';

import {handleActions} from '@neos-project/utils-redux';
import {actionTypes as system} from '../../System/index';

const TOGGLE = '@neos/neos-ui/UI/FullScreen/TOGGLE';

//
// Export the action types
//
export const actionTypes = {
    TOGGLE
};

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
    [system.INIT]: payload => $set(
        'ui.fullScreen',
        Immutable.fromJS($get('ui.fullScreen', payload) ? $get('ui.fullScreen', payload) : {isFullScreen: false})
    ),
    [TOGGLE]: () => $toggle('ui.fullScreen.isFullScreen')
});

//
// Export the selectors
//
export const selectors = {};
