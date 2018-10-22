import {takeLatest} from 'redux-saga/effects';

import {actionTypes} from '@neos-project/neos-ui-redux-store';
import backend from '@neos-project/neos-ui-backend-connector';
import {getGuestFrameWindow} from '@neos-project/neos-ui-guest-frame/src/dom';

/**
 * Save currently-chosen EditPreviewMode, and refresh the UI
 */
export function * watchEditPreviewModesChanged() {
    yield takeLatest(actionTypes.UI.EditPreviewMode.SET, function * editPreviewModeSet(action) {
        const {editPreviewMode} = action.payload;

        yield backend.get().endpoints.setUserPreferences('contentEditing.editPreviewMode', editPreviewMode);
        getGuestFrameWindow().location.reload();
    });
}
