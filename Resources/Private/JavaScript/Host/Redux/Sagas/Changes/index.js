import {takeEvery} from 'redux-saga';
import {put, call} from 'redux-saga/effects';

import {actionTypes, actions} from 'Host/Redux/index';
import {change} from 'API/Endpoints/index';
import backend from 'Host/Service/Backend.js';

export function* watchPersist() {
    yield* takeEvery(actionTypes.Changes.PERSIST, function* persistChanges(action) {
        const changes = [action.payload.change];
        const {feedbackManager} = backend;

        yield put(actions.UI.Remote.startSaving());
        try {
            const feedback = yield call(change, changes);
            yield put(actions.UI.Remote.finishSaving());
            yield put(feedbackManager.handleFeedback.bind(feedbackManager)(feedback));
        } catch (error) {
            console.error('Failed to persist changes', error);
        }
    });
}
