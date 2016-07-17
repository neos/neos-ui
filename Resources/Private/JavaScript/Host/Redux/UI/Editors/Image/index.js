import {createAction} from 'redux-actions';
import {$set, $toggle} from 'plow-js';
import {Map} from 'immutable';

import {handleActions} from 'Shared/Utilities/index';
import {actionTypes as system} from 'Host/Redux/System/index';

const TOGGLE_IMAGE_DETAILS_SCREEN = '@packagefactory/guevara/UI/Editors/Image/TOGGLE_IMAGE_DETAILS_SCREEN';
const UPDATE_IMAGE = '@packagefactory/guevara/UI/Editors/Image/UPDATE_IMAGE';
const UPLOAD_IMAGE = '@packagefactory/guevara/UI/Editors/Image/UPLOAD_IMAGE';
const FINISH_IMAGE_UPLOAD = '@packagefactory/guevara/UI/Editors/Image/FINISH_IMAGE_UPLOAD';

const toggleImageDetailsScreen = createAction(TOGGLE_IMAGE_DETAILS_SCREEN, (screenIdentifier) => ({screenIdentifier}));
const updateImage = createAction(UPDATE_IMAGE, (nodeContextPath, imageUuid, transientImage) => ({nodeContextPath, imageUuid, transientImage}));
const uploadImage = createAction(UPLOAD_IMAGE, (fileToUpload, nodePropertyValueChangeFn, screenIdentifier) => ({fileToUpload, nodePropertyValueChangeFn, screenIdentifier}));
const finishImageUpload = createAction(FINISH_IMAGE_UPLOAD, () => ({}));

//
// Export the actions
//
export const actions = {
    toggleImageDetailsScreen,
    updateImage,
    uploadImage,
    finishImageUpload
};

export const actionTypes = {
    TOGGLE_IMAGE_DETAILS_SCREEN,
    UPDATE_IMAGE,
    UPLOAD_IMAGE,
    FINISH_IMAGE_UPLOAD
};

const IMAGE_DETAILS_SCREEN_PATH = 'ui.editors.image.visibleDetailsScreen';
//
// Export the reducer
//
export const reducer = handleActions({
    [system.INIT]: () => $set(
        'ui.editors.image',
        new Map({
            visibleDetailsScreen: false,
            currentlyUploadingScreen: ''
        })
    ),
    [TOGGLE_IMAGE_DETAILS_SCREEN]: ({screenIdentifier}) => $toggle(IMAGE_DETAILS_SCREEN_PATH, screenIdentifier, ''),
    [UPDATE_IMAGE]: ({nodeContextPath, imageUuid, transientImage}) => $set(['ui', 'inspector', 'valuesByNodePath', nodeContextPath, 'images', imageUuid], transientImage),
    // UPLOAD_IMAGE is generally handled by saga, we just set the "current upload screen" here; so that the loading indicator displays correctly.
    [UPLOAD_IMAGE]: ({screenIdentifier}) => $set('ui.editors.image.currentlyUploadingScreen', screenIdentifier),
    [FINISH_IMAGE_UPLOAD]: () => $set('ui.editors.image.currentlyUploadingScreen', '')
});
