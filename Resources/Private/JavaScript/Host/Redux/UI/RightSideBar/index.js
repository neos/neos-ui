import Immutable from 'immutable';
import {immutableOperations} from 'Shared/Utilities/';
import {createAction, handleActions} from 'redux-actions';

const {$get, $set} = immutableOperations;

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
// Export the reducer
//
const initialState = Immutable.fromJS({
    isHidden: false
});

export const reducer = handleActions({
    [TOGGLE]: state => {
        const isCurrentlyHidden = $get(state, 'isHidden');

        return $set(state, 'isHidden', !isCurrentlyHidden);
    }
}, initialState);

//
// Export the event map
//
export const events = {
};
