import {createAction} from 'redux-actions';
import {$set, $drop} from 'plow-js';
import {Map} from 'immutable';



const OPEN_CROP_SCREEN = '@packagefactory/guevara/UI/Editors/Image/OPEN_CROP_SCREEN';
const openCropScreen = createAction(OPEN_CROP_SCREEN, () => ({}));

//
// Export the actions
//
export const actions = {
    openCropScreen
};

export const actionTypes = {
    OPEN_CROP_SCREEN
};

//
// Export the initial state
//
export const hydrate = () => new Map({
    isOpen: false
});

//
// Export the reducer
//
export const reducer = {
    [OPEN_CROP_SCREEN]: () => $set(['ui', 'editors', 'image', 'cropScreenVisible'], true)
};
