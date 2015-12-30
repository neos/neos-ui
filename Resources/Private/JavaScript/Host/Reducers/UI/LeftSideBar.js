import {ActionTypes} from '../../Constants/';
import {immutableOperations} from '../../../Shared/Util/';

const {$get, $set} = immutableOperations;

export default {
    [ActionTypes.UI.TOGGLE_LEFT_SIDEBAR](state) {
        const isCurrentlyHidden = $get(state, 'ui.leftSidebar.isHidden');

        return $set(state, 'ui.leftSidebar.isHidden', !isCurrentlyHidden);
    }
};
