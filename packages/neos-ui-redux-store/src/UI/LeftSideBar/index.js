import {createAction} from 'redux-actions';
import {Map} from 'immutable';
import {$set, $toggle} from 'plow-js';

import {handleActions} from '@neos-project/utils-redux';
import {actionTypes as system} from '../../System/index';

const TOGGLE = '@neos/neos-ui/UI/LeftSideBar/TOGGLE';

//
// Export the action types
//
export const actionTypes = {
    TOGGLE
};

/**
 * Toggles the left sidebar out/in of the users viewport.
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
        'ui.leftSideBar',
        new Map({
            isHidden: false
        })
    ),
    [TOGGLE]: () => $toggle('ui.leftSideBar.isHidden')
});

//
// Export the selectors
//
export const selectors = {};
