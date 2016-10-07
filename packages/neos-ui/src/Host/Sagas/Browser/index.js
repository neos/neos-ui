import {takeEvery} from 'redux-saga';

import {actionTypes} from 'Host/Redux/index';

function * watchContentURIChange() {
    yield * takeEvery(actionTypes.UI.ContentCanvas.SET_CONTEXT_PATH, function * reflectChangeInAddressBar(action) {
        const {contextPath} = action.payload;

        yield history.pushState({}, '', `?node=${contextPath}`);
    });
}

export const sagas = [
    watchContentURIChange
];
