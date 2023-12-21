import {put, call, select, takeEvery, takeLatest, take, race} from 'redux-saga/effects';

import {actionTypes, actions, selectors} from '@neos-project/neos-ui-redux-store';
import backend from '@neos-project/neos-ui-backend-connector';
import {getGuestFrameDocument} from '@neos-project/neos-ui-guest-frame/src/dom';

export function * watchPublish() {
    const {publish} = backend.get().endpoints;

    yield takeEvery(actionTypes.CR.Workspaces.PUBLISH, function * publishNodes(action) {
        const {nodeContextPaths, targetWorkspaceName} = action.payload;

        if (nodeContextPaths.length > 0) {
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

export function * watchChangeBaseWorkspace() {
    const {changeBaseWorkspace} = backend.get().endpoints;
    yield takeEvery(actionTypes.CR.Workspaces.CHANGE_BASE_WORKSPACE, function * change(action) {
        try {
            const documentNode = yield select(
                state => state?.cr?.nodes?.documentNode
            );
            const feedback = yield call(changeBaseWorkspace, action.payload, documentNode);
            yield put(actions.ServerFeedback.handleServerFeedback(feedback));

            // Reload the page tree
            yield put(actions.CR.Nodes.reloadState());
        } catch (error) {
            console.error('Failed to change base workspace', error);
        }
    });
}

export function * watchRebaseWorkspace() {
    const {rebaseWorkspace, getWorkspaceInfo} = backend.get().endpoints;
    yield takeEvery(actionTypes.CR.Workspaces.REBASE_WORKSPACE, function * change(action) {
        yield put(actions.UI.Remote.startSynchronization());

        try {
            const feedback = yield call(rebaseWorkspace, action.payload);
            yield put(actions.ServerFeedback.handleServerFeedback(feedback));
        } catch (error) {
            console.error('Failed to sync user workspace', error);
        } finally {
            const workspaceInfo = yield call(getWorkspaceInfo);
            yield put(actions.CR.Workspaces.update(workspaceInfo));
            yield put(actions.UI.Remote.finishSynchronization());
        }
    });
}

export function * discardIfConfirmed() {
    const {discard} = backend.get().endpoints;
    yield takeLatest(actionTypes.CR.Workspaces.COMMENCE_DISCARD, function * waitForConfirmation() {
        const state = yield select();
        const waitForNextAction = yield race([
            take(actionTypes.CR.Workspaces.DISCARD_ABORTED),
            take(actionTypes.CR.Workspaces.DISCARD_CONFIRMED)
        ]);
        const nextAction = Object.values(waitForNextAction)[0];

        if (nextAction.type === actionTypes.CR.Workspaces.DISCARD_ABORTED) {
            return;
        }

        if (nextAction.type === actionTypes.CR.Workspaces.DISCARD_CONFIRMED) {
            yield put(actions.UI.Remote.startDiscarding());
            const nodesToBeDiscarded = state?.cr?.workspaces?.toBeDiscarded;

            try {
                const currentContentCanvasContextPath = yield select(selectors.CR.Nodes.documentNodeContextPathSelector);

                const feedback = yield call(discard, nodesToBeDiscarded);
                yield put(actions.UI.Remote.finishDiscarding());
                yield put(actions.ServerFeedback.handleServerFeedback(feedback));

                // Check if the currently focused document node has been removed
                const contentCanvasNodeIsStillThere = Boolean(yield select(selectors.CR.Nodes.byContextPathSelector(currentContentCanvasContextPath)));

                // If not, reload the document
                if (contentCanvasNodeIsStillThere) {
                    getGuestFrameDocument().location.reload();
                }

                // Reload the page tree
                yield put(actions.CR.Nodes.reloadState());
            } catch (error) {
                console.error('Failed to discard', error);
            }
        }
    });
}
