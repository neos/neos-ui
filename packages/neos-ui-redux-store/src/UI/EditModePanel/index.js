import {createAction} from 'redux-actions';
import {$get, $set, $toggle} from 'plow-js';

import {handleActions} from '@neos-project/utils-redux';
import {actionTypes as system} from '../../System/index';
import {fromJSOrdered} from '@neos-project/utils-helpers';

const TOGGLE = '@neos/neos-ui/UI/EditModePanel/TOGGLE';

//
// Export the action types
//
export const actionTypes = {
    TOGGLE
};

/**
 * Toggles the edit mode panel's visibility.'
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
        'ui.editModePanel',
        fromJSOrdered($get('ui.editModePanel', payload) ? $get('ui.editModePanel', payload) : {isHidden: true})
    ),
    [TOGGLE]: () => $toggle('ui.editModePanel.isHidden')
});

//
// Export the selectors
//
export const selectors = {};
