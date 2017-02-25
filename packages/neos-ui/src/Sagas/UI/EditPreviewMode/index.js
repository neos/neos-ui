import {takeLatest} from 'redux-saga';

import {actionTypes} from '@neos-project/neos-ui-redux-store';
import backend from '@neos-project/neos-ui-backend-connector';
import {dom} from '../../../Containers/ContentCanvas/Helpers/index';

/**
 * Save currently-chosen EditPreviewMode, and refresh the UI
 */
function * watchEditPreviewModesChanged() {
    yield * takeLatest(actionTypes.UI.EditPreviewMode.SET, function * editPreviewModeSet(action) {
        const {editPreviewMode} = action.payload;

        yield backend.get().endpoints.setUserPreferences('contentEditing.editPreviewMode', editPreviewMode);
        dom.iframeWindow().location.reload();
    });
}

export const sagas = [
    watchEditPreviewModesChanged
];
