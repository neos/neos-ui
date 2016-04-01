import {createAction} from 'redux-actions';
import {$get, $set, $drop} from 'plow-js';
import {Map} from 'immutable';



const OPEN_CROP_SCREEN = '@packagefactory/guevara/UI/Editors/Image/OPEN_CROP_SCREEN';
const UPDATE_IMAGE = '@packagefactory/guevara/UI/Editors/Image/UPDATE_IMAGE';


const openCropScreen = createAction(OPEN_CROP_SCREEN, (cropImageIdentifier) => ({cropImageIdentifier}));
const updateImage = createAction(UPDATE_IMAGE, (nodeContextPath, imageUuid, transientImage) => ({nodeContextPath, imageUuid, transientImage}));

//
// Export the actions
//
export const actions = {
    openCropScreen,
    updateImage
};

export const actionTypes = {
    OPEN_CROP_SCREEN,
    UPDATE_IMAGE
};

//
// Export the initial state
//
export const hydrate = () => new Map({
    isOpen: false
});


const CROP_SCREEN_STATE_PATH = 'ui.editors.image.cropScreenVisible';
//
// Export the reducer
//
export const reducer = {
    [OPEN_CROP_SCREEN]: ({cropImageIdentifier}) => state => {
        if ($get(CROP_SCREEN_STATE_PATH, state) === cropImageIdentifier) {
            return $set(CROP_SCREEN_STATE_PATH, null, state);
        }
        return $set(CROP_SCREEN_STATE_PATH, cropImageIdentifier, state);
    },
    [UPDATE_IMAGE]: ({nodeContextPath, imageUuid, transientImage}) => $set(['ui', 'inspector', 'valuesByNodePath', nodeContextPath, 'images', imageUuid], transientImage) // !!! DIFFERENT PATH -> in ui.inspector!!!
};
