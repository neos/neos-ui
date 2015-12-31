import {ActionTypes} from '../../Constants/';
import {immutableOperations} from '../../../Shared/Util/';

const {$get, $set} = immutableOperations;

export default {
    [ActionTypes.UI.TOGGLE_OFF_CANVAS](state) {
        const isCurrentlyHidden = $get(state, 'ui.offCanvas.isHidden');

        return $set(state, 'ui.offCanvas.isHidden', !isCurrentlyHidden);
    },
    [ActionTypes.UI.HIDE_OFF_CANVAS](state) {
        return $set(state, 'ui.offCanvas.isHidden', true);
    }
};
