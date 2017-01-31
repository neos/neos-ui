import {createAction} from 'redux-actions';
import Immutable from 'immutable';
import {$toggle, $set, $get} from 'plow-js';

import {handleActions} from '@neos-project/utils-redux';
import {actionTypes as system} from '../../System/index';

const TOGGLE = '@neos/neos-ui/UI/RightSidebar/TOGGLE';

//
// Export the action types
//
export const actionTypes = {
    TOGGLE
};

/**
 * Toggles the right sidebar out/in of the users viewport.
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
        'ui.rightSideBar',
        Immutable.fromJS($get('ui.rightSideBar', payload) ? $get('ui.rightSideBar', payload) : {isHidden: false})
    ),
    [TOGGLE]: () => $toggle('ui.rightSideBar.isHidden')
});

//
// Export the selectors
//
export const selectors = {
    isHidden: $get('ui.rightSideBar.isHidden')
};
