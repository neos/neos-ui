import {createAction} from 'redux-actions';
import {Map} from 'immutable';
import {$set, $toggle} from 'plow-js';

const TOGGLE = '@neos/neos-ui/UI/LeftSideBar/TOGGLE';

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
// Export the initial state hydrator
//
export const hydrate = () => $set(
    'ui.leftSideBar',
    new Map({
        isHidden: false
    })
);

//
// Export the reducer
//
export const reducer = {
    [TOGGLE]: () => $toggle('ui.leftSideBar.isHidden')
};
