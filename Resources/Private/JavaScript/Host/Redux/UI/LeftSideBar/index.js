import Immutable from 'immutable';
import {createAction, handleActions} from 'redux-actions';
import {immutableOperations} from 'Shared/Util/';

const {$get, $set} = immutableOperations;

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
