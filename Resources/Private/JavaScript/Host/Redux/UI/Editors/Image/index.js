import {createAction} from 'redux-actions';
import {$set, $drop} from 'plow-js';
import {Map} from 'immutable';



const OPEN_CROP_SCREEN = '@packagefactory/guevara/UI/Editors/Image/OPEN_CROP_SCREEN';
const CROP_IMAGE = '@packagefactory/guevara/UI/Editors/Image/CROP_IMAGE';


const openCropScreen = createAction(OPEN_CROP_SCREEN, () => ({}));
const cropImage = createAction(CROP_IMAGE, (nodeContextPath, imageUuid, transientImage) => ({nodeContextPath, imageUuid, transientImage}));

//
// Export the actions
//
export const actions = {
    openCropScreen,
    cropImage
};

export const actionTypes = {
    OPEN_CROP_SCREEN,
    CROP_IMAGE
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
    [OPEN_CROP_SCREEN]: () => $set(['ui', 'editors', 'image', 'cropScreenVisible'], true),
    [CROP_IMAGE]: ({nodeContextPath, imageUuid, transientImage}) => $set(['ui', 'inspector', 'valuesByNodePath', nodeContextPath, 'images', imageUuid], transientImage) // !!! DIFFERENT PATH -> in ui.inspector!!!
};
