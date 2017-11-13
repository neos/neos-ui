import {takeEvery} from 'redux-saga';
import {call} from 'redux-saga/effects';
import {actionTypes} from '@neos-project/neos-ui-redux-store';

export function * reflectChangeInAddressBar(action) {
    yield call(history.replaceState, {}, '', `?node=${action.payload.contextPath}`);
}

export function * watchContentURIChange() {
    yield * takeEvery(actionTypes.UI.ContentCanvas.SET_CONTEXT_PATH, reflectChangeInAddressBar);
}

export const sagas = [
    watchContentURIChange
];

export default sagas;
