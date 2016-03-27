import {createAction} from 'redux-actions';
import {Map} from 'immutable';
import {$toggle} from 'plow-js';

const TOGGLE = '@packagefactory/guevara/UI/RightSidebar/TOGGLE';

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
// Export the initial state hydrator
//
export const hydrate = () => new Map({
    ui: new Map({
        rightSideBar: new Map({
            isHidden: false
        })
    })
});

//
// Export the reducer
//
export const reducer = {
    [TOGGLE]: () => $toggle('ui.rightSideBar.isHidden')
};
