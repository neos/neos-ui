import {immutableOperations} from 'Shared/Util/';
import {createAction, handleActions} from 'redux-actions';

const {$get, $set} = immutableOperations;

const TOGGLE = '@packagefactory/guevara/UI/RightSidebar/TOGGLE';

export default handleActions({
    [TOGGLE]: state => {
        const isCurrentlyHidden = $get(state, 'ui.rightSidebar.isHidden');

        return $set(state, 'ui.rightSidebar.isHidden', !isCurrentlyHidden);
    }
});

/**
 * Toggles the right sidebar out/in of the users viewport.
 */
export const toggle = createAction(TOGGLE);
