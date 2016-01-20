import Immutable from 'immutable';
import {immutableOperations} from 'Shared/Util/';
import {createAction, handleActions} from 'redux-actions';

const {$get, $set} = immutableOperations;

const TOGGLE = '@packagefactory/guevara/UI/OffCanvas/TOGGLE';
const HIDE = '@packagefactory/guevara/UI/OffCanvas/HIDE';
const initialState = Immutable.fromJS({
    isHidden: true
});

export default handleActions({
    [TOGGLE]: state => {
        const isCurrentlyHidden = $get(state, 'isHidden');

        return $set(state, 'isHidden', !isCurrentlyHidden);
    },
    [HIDE]: state => $set(state, 'isHidden', true)
}, initialState);

/**
 * Toggles the off canvas menu out/in of the users viewport.
 */
export const toggle = createAction(TOGGLE);

/**
 * Hides the off canvas menu.
 */
export const hide = createAction(HIDE);
