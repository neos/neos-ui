import {takeEvery} from 'redux-saga';

import {actionTypes} from '@neos-project/neos-ui-redux-store';

function * watchContentURIChange() {
    yield * takeEvery(actionTypes.UI.ContentCanvas.SET_CONTEXT_PATH, function * reflectChangeInAddressBar(action) {
        const {contextPath} = action.payload;

        yield history.replaceState({}, '', `?node=${contextPath}`);
    });
}

export const sagas = [
    watchContentURIChange
];
