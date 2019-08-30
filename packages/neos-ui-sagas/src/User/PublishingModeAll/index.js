import {takeLatest} from 'redux-saga/effects';

import {actionTypes} from '@neos-project/neos-ui-redux-store';
import backend from '@neos-project/neos-ui-backend-connector';

/**
 * Save currently-chosen PublishingModeAll
 */
export function * watchPublishingModeAllChanged() {
    yield takeLatest(actionTypes.User.Settings.TOGGLE_PUBLISHING_MODE_ALL, function * publishingModeAllChanged(action) {
        const isPublishingModeAll = action.payload;

        yield backend.get().endpoints.setUserPreferences('isPublishingModeAll', isPublishingModeAll);
    });
}
