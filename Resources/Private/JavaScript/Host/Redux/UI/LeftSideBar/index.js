import {immutableOperations} from 'Shared/Util/';
import {createAction, handleActions} from 'redux-actions';

const {$get, $set} = immutableOperations;

const TOGGLE = '@packagefactory/guevara/UI/LeftSideBar/TOGGLE';

export default handleActions({
    [TOGGLE]: state => {
        const isCurrentlyHidden = $get(state, 'ui.leftSidebar.isHidden');

        return $set(state, 'ui.leftSidebar.isHidden', !isCurrentlyHidden);
    }
});

/**
 * Toggles the left sidebar out/in of the users viewport.
 */
export const toggle = createAction(TOGGLE);
