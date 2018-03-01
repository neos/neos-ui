import {call, takeEvery} from 'redux-saga/effects';
import {actionTypes} from '@neos-project/neos-ui-redux-store';

export function * reflectChangeInAddressBar(action) {
    const {
        workspaceName,
        dimensionSpacePoint,
        documentNodeAggregateIdentifier
    } = action.payload;
    yield call([history, history.replaceState], {}, '', `?workspaceName=${workspaceName}&dimensionSpacePoint=${dimensionSpacePoint}&documentNodeAggregateIdentifier=${documentNodeAggregateIdentifier}`);
}

export function * watchContentURIChange() {
    yield takeEvery(actionTypes.UI.ContentCanvas.LOADED, reflectChangeInAddressBar);
}
