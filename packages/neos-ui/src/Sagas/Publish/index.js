import {takeEvery} from 'redux-saga';
import {put, call, select} from 'redux-saga/effects';
import {$get} from 'plow-js';

import {actionTypes, actions, selectors} from '@neos-project/neos-ui-redux-store';
import {publish, discard} from '@neos-project/neos-ui-backend-connector';

const {publishableNodesInDocumentSelector} = selectors.CR.Workspaces;

function * watchPublish() {
    yield * takeEvery(actionTypes.CR.Workspaces.PUBLISH, function * publishNodes(action) {
        const {nodeContextPaths, targetWorkspaceName} = action.payload;

        if (nodeContextPaths.count() > 0) {
            yield put(actions.UI.Remote.startPublishing());

            try {
                const feedback = yield call(publish, nodeContextPaths, targetWorkspaceName);
                yield put(actions.UI.Remote.finishPublishing());
                yield put(actions.ServerFeedback.handleServerFeedback(feedback));
            } catch (error) {
                console.error('Failed to publish', error);
            }
        }
    });
}

function * watchToggleAutoPublish() {
    yield * takeEvery(actionTypes.User.Settings.TOGGLE_AUTO_PUBLISHING, function * publishInitially() {
        const state = yield select();
        const isAutoPublishingEnabled = $get('user.settings.isAutoPublishingEnabled', state);

        if (isAutoPublishingEnabled) {
            const publishableNodesInDocument = publishableNodesInDocumentSelector(state);
            yield put(actions.CR.Workspaces.publish(publishableNodesInDocument.map($get('contextPath')), 'live'));
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
    watchToggleAutoPublish,
    watchDiscard
];
