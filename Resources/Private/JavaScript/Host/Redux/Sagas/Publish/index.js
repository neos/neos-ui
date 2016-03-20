import {takeEvery} from 'redux-saga';
import {put, call} from 'redux-saga/effects';

import {actionTypes, actions} from 'Host/Redux/index';
import {publish, discard} from 'API/Endpoints/index';
import backend from 'Host/Service/Backend.js';

export function* watchPublish() {
    yield* takeEvery(actionTypes.CR.Workspaces.PUBLISH, function* publishNodes(action) {
        const {nodeContextPaths, targetWorkspaceName} = action.payload;
        const {feedbackManager} = backend;

        yield put(actions.UI.Remote.startPublishing());
        try {
            const feedback = yield call(publish, nodeContextPaths, targetWorkspaceName);
            yield put(actions.UI.Remote.finishPublishing());
            yield put(feedbackManager.handleFeedback.bind(feedbackManager)(feedback));
        } catch (error) {
            console.error('Failed to publish', error);
        }
    });
}

export function* watchDiscard() {
    yield* takeEvery(actionTypes.CR.Workspaces.DISCARD, function* discardNodes(action) {
        const {nodeContextPaths} = action.payload;
        const {feedbackManager} = backend;

        yield put(actions.UI.Remote.startDiscarding());
        try {
            const feedback = yield call(discard, nodeContextPaths);
            yield put(actions.UI.Remote.finishDiscarding());
            yield put(feedbackManager.handleFeedback.bind(feedbackManager)(feedback));
        } catch (error) {
            console.error('Failed to discard', error);
        }
    });
}
