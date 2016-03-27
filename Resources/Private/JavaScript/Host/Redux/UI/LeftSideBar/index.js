import {createAction} from 'redux-actions';
import {Map} from 'immutable';
import {$toggle} from 'plow-js';

const TOGGLE = '@packagefactory/guevara/UI/LeftSideBar/TOGGLE';

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
export const hydrate = () => new Map({
    ui: new Map({
        leftSideBar: new Map({
            isHidden: false
        })
    })
});

//
// Export the reducer
//
export const reducer = {
    [TOGGLE]: () => $toggle('ui.leftSideBar.isHidden')
};
