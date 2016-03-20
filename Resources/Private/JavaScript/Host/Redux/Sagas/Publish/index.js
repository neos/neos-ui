import {takeEvery} from 'redux-saga';
import {put, call} from 'redux-saga/effects';

import {actionTypes, actions} from 'Host/Redux/index';
import {publish, discard} from 'API/Endpoints/index';

export function* watchPublish() {
    yield* takeEvery(actionTypes.Publish.PUBLISH, function* publishNodes(action) {
        const {nodeContextPaths, targetWorkspaceName} = action.payload;

        yield put(actions.UI.Remote.startPublishing());
        try {
            yield call(publish, nodeContextPaths, targetWorkspaceName);
            yield put(actions.UI.Remote.finishPublishing());
            yield put(actions.CR.Workspaces.clear(nodeContextPaths));
        } catch (error) {
            console.error('Failed to publish', error);
        }
    });
}
export function* watchDiscard() {
    yield* takeEvery(actionTypes.Publish.DISCARD, function* discardNodes(action) {
        const {nodeContextPaths} = action.payload;

        yield put(actions.UI.Remote.startDiscarding());
        try {
            yield call(discard, nodeContextPaths);
            yield put(actions.UI.Remote.finishDiscarding());
            console.log(actions.CR.Workspaces.clear);
            yield put(actions.CR.Workspaces.clear(nodeContextPaths));
        } catch (error) {
            console.error('Failed to discard', error);
        }
    });
}
