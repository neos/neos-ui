import {takeEvery} from 'redux-saga';
import {put, call} from 'redux-saga/effects';

import {actionTypes, actions} from 'Host/Redux/index';
import {publish, discard} from 'API/Endpoints/index';

function * watchPublish() {
    yield * takeEvery(actionTypes.CR.Workspaces.PUBLISH, function * publishNodes(action) {
        const {nodeContextPaths, targetWorkspaceName} = action.payload;

        yield put(actions.UI.Remote.startPublishing());

        try {
            const feedback = yield call(publish, nodeContextPaths, targetWorkspaceName);
            yield put(actions.UI.Remote.finishPublishing());
            yield put(actions.ServerFeedback.handleServerFeedback(feedback));
        } catch (error) {
            console.error('Failed to publish', error);
        }
    });
}

function * watchDiscard() {
    yield * takeEvery(actionTypes.CR.Workspaces.DISCARD, function * discardNodes(action) {

        yield put(actions.UI.Remote.startDiscarding());

        try {
            const feedback = yield call(discard, action.payload);
            yield put(actions.UI.Remote.finishDiscarding());
            yield put(actions.ServerFeedback.handleServerFeedback(feedback));
        } catch (error) {
            console.error('Failed to discard', error);
        }
    });
}

export const sagas = [
    watchPublish,
    watchDiscard
];
