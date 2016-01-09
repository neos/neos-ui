import {immutableOperations} from 'Shared/Util/';
import {createAction, handleActions} from 'redux-actions';

const {$get, $set} = immutableOperations;

const TOGGLE = '@packagefactory/guevara/UI/OffCanvas/TOGGLE';
const HIDE = '@packagefactory/guevara/UI/OffCanvas/HIDE';

export default handleActions({
    [TOGGLE]: state => {
        const isCurrentlyHidden = $get(state, 'ui.offCanvas.isHidden');

        return $set(state, 'ui.offCanvas.isHidden', !isCurrentlyHidden);
    },
    [HIDE]: state => $set(state, 'ui.offCanvas.isHidden', true)
});

/**
 * Toggles the off canvas menu out/in of the users viewport.
 */
export const toggle = createAction(TOGGLE);

/**
 * Hides the off canvas menu.
 */
export const hide = createAction(HIDE);
