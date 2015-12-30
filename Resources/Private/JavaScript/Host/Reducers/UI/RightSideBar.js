import {ActionTypes} from '../../Constants/';
import {immutableOperations} from '../../../Shared/Util/';

const {$get, $set} = immutableOperations;

export default {
    [ActionTypes.UI.TOGGLE_RIGHT_SIDEBAR](state) {
        const isCurrentlyHidden = $get(state, 'ui.rightSidebar.isHidden');

        return $set(state, 'ui.rightSidebar.isHidden', !isCurrentlyHidden);
    }
};
