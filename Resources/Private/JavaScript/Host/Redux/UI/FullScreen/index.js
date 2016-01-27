import Immutable from 'immutable';
import {immutableOperations} from 'Shared/Utilities/';
import {createAction, handleActions} from 'redux-actions';

const {$get, $set} = immutableOperations;

const TOGGLE = '@packagefactory/guevara/UI/FullScreen/TOGGLE';

/**
 * Toggles the fullscreen mode on/off.
 */
const toggle = createAction(TOGGLE);

export const actions = {
    toggle
};

const initialState = Immutable.fromJS({
    isFullScreen: false
});

export const reducer = handleActions({
    [TOGGLE]: state => {
        const isFullScreen = $get(state, 'isFullScreen');
        return $set(state, 'isFullScreen', !isFullScreen);
    }
}, initialState);
