import {createAction} from 'redux-actions';
import {Map} from 'immutable';
import {$toggle, $set} from 'plow-js';

import {handleActions} from 'Shared/Utilities/index';
import {actionTypes as system} from 'Host/Redux/System/index';

const TOGGLE = '@neos/neos-ui/UI/RightSidebar/TOGGLE';

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
    [system.INIT]: () => $set(
        'ui.rightSideBar',
        new Map({
            isHidden: false
        })
    ),
    [TOGGLE]: () => $toggle('ui.rightSideBar.isHidden')
});

//
// Export the selectors
//
export const selectors = {};
