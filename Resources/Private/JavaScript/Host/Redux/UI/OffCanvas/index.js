import Immutable from 'immutable';
import {immutableOperations} from 'Shared/Util/';
import {createAction, handleActions} from 'redux-actions';

const {$get, $set} = immutableOperations;

const TOGGLE = '@packagefactory/guevara/UI/OffCanvas/TOGGLE';
const HIDE = '@packagefactory/guevara/UI/OffCanvas/HIDE';

/**
 * Toggles the off canvas menu out/in of the users viewport.
 */
const toggle = createAction(TOGGLE);

/**
 * Hides the off canvas menu.
 */
const hide = createAction(HIDE);

//
// Export the actions
//
export const actions = {
    toggle,
    hide
};

//
// Export the reducer
//
const initialState = Immutable.fromJS({
    isHidden: true
});

export const reducer = handleActions({
    [TOGGLE]: state => {
        const isCurrentlyHidden = $get(state, 'isHidden');

        return $set(state, 'isHidden', !isCurrentlyHidden);
    },
    [HIDE]: state => $set(state, 'isHidden', true)
}, initialState);
