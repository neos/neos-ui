import {takeLatest} from 'redux-saga/effects';

import {actionTypes} from '@neos-project/neos-ui-redux-store';
import backend from '@neos-project/neos-ui-backend-connector';

/**
 * Save currently-chosen AutoPublishingEnabled
 */
export function * watchAutoPublishingEnabledChanged() {
    yield takeLatest(actionTypes.User.Settings.TOGGLE_AUTO_PUBLISHING, function * autoPublishingEnabledChanged(action) {
        const isAutoPublishingEnabled = action.payload;

        yield backend.get().endpoints.setUserPreferences('isAutoPublishingEnabled', isAutoPublishingEnabled);
    });
}
