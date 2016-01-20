import Immutable from 'immutable';
import {createAction, handleActions} from 'redux-actions';
import {immutableOperations} from 'Shared/Util/';

const {$get, $set} = immutableOperations;

const TOGGLE = '@packagefactory/guevara/UI/LeftSideBar/TOGGLE';
const initialState = Immutable.fromJS({
    isHidden: false
});

export default handleActions({
    [TOGGLE]: state => {
        const isCurrentlyHidden = $get(state, 'isHidden');

        return $set(state, 'isHidden', !isCurrentlyHidden);
    }
}, initialState);

/**
 * Toggles the left sidebar out/in of the users viewport.
 */
export const toggle = createAction(TOGGLE);
