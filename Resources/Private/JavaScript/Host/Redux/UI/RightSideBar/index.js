import Immutable from 'immutable';
import {immutableOperations} from 'Shared/Util/';
import {createAction, handleActions} from 'redux-actions';

const {$get, $set} = immutableOperations;

const TOGGLE = '@packagefactory/guevara/UI/RightSidebar/TOGGLE';
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
 * Toggles the right sidebar out/in of the users viewport.
 */
export const toggle = createAction(TOGGLE);
