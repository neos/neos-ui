import {createAction} from 'redux-actions';
import {Map} from 'immutable';
import {$get, $set, $toggle} from 'plow-js';

import {handleActions} from '@neos-project/utils-redux';
import {actionTypes as system} from '../../System/index';

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
    [system.INIT]: state => $set(
        'ui.editModePanel',
        new Map({
            isHidden: $get('ui.editModePanel.isHidden', state)
        })
    ),
    [TOGGLE]: () => $toggle('ui.editModePanel.isHidden')
});

//
// Export the selectors
//
export const selectors = {};
