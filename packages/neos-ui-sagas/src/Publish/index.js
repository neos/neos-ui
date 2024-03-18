import {put, call, select, takeEvery, takeLatest, take, race} from 'redux-saga/effects';

import {actionTypes, actions, selectors} from '@neos-project/neos-ui-redux-store';
import {PublishDiscardScope} from '@neos-project/neos-ui-redux-store/src/CR/Workspaces';
import backend from '@neos-project/neos-ui-backend-connector';
import {getGuestFrameDocument} from '@neos-project/neos-ui-guest-frame/src/dom';

export function * watchPublish() {
    const {publishSite, publishDocument} = backend.get().endpoints;

    yield takeEvery(actionTypes.CR.Workspaces.PUBLISH_STARTED, function * publishNodes(action) {
        const {scope} = action.payload;
        const workspaceName = yield select(selectors.CR.Workspaces.personalWorkspaceNameSelector);

        yield put(actions.UI.Remote.startPublishing());

        let feedback = null;
        let publishedNodes = [];
        try {
            if (scope === PublishDiscardScope.SITE) {
                const siteId = yield select(selectors.CR.Nodes.siteNodeContextPathSelector);
                publishedNodes = yield select(selectors.CR.Workspaces.publishableNodesSelector);
                feedback = yield call(publishSite, siteId, workspaceName);
            } else if (scope === PublishDiscardScope.DOCUMENT) {
                const documentId = yield select(selectors.CR.Nodes.documentNodeContextPathSelector);
                publishedNodes = yield select(selectors.CR.Workspaces.publishableNodesInDocumentSelector);
                feedback = yield call(publishDocument, documentId, workspaceName);
            }
        } catch (error) {
            console.error('Failed to publish', error);
        }

        if (feedback !== null) {
            yield put(actions.ServerFeedback.handleServerFeedback(feedback));
        }

        yield put(actions.CR.Workspaces.finishPublish(publishedNodes));
        yield put(actions.UI.Remote.finishPublishing());
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
    yield takeLatest(actionTypes.CR.Workspaces.DISCARD_STARTED, function * waitForConfirmation(action) {
        const waitForNextAction = yield race([
            take(actionTypes.CR.Workspaces.DISCARD_ABORTED),
            take(actionTypes.CR.Workspaces.DISCARD_CONFIRMED)
        ]);
        const nextAction = Object.values(waitForNextAction)[0];

        if (nextAction.type === actionTypes.CR.Workspaces.DISCARD_ABORTED) {
            return;
        }

        if (nextAction.type === actionTypes.CR.Workspaces.DISCARD_CONFIRMED) {
            yield* discard(action.payload.scope);
        }
    });
}

function *discard(scope) {
    const {discardSite, discardDocument} = backend.get().endpoints;
    const workspaceName = yield select(selectors.CR.Workspaces.personalWorkspaceNameSelector);

    yield put(actions.UI.Remote.startDiscarding());

    let feedback = null;
    let discardedNodes = [];
    try {
        if (scope === PublishDiscardScope.SITE) {
            const siteId = yield select(selectors.CR.Nodes.siteNodeContextPathSelector);
            discardedNodes = yield select(selectors.CR.Workspaces.publishableNodesSelector);
            feedback = yield call(discardSite, siteId, workspaceName);
        } else if (scope === PublishDiscardScope.DOCUMENT) {
            const documentId = yield select(selectors.CR.Nodes.documentNodeContextPathSelector);
            discardedNodes = yield select(selectors.CR.Workspaces.publishableNodesInDocumentSelector);
            feedback = yield call(discardDocument, documentId, workspaceName);
        }
    } catch (error) {
        console.error('Failed to discard', error);
    }

    try {
        if (feedback !== null) {
            yield put(actions.ServerFeedback.handleServerFeedback(feedback));
        }

        yield* reloadAfterPublishOrDiscard();

        yield put(actions.CR.Workspaces.finishDiscard(discardedNodes));
        yield put(actions.UI.Remote.finishDiscarding());
    } catch (error) {
        console.log({error});
    }
}

function *reloadAfterPublishOrDiscard() {
    const currentContentCanvasContextPath = yield select(selectors.CR.Nodes.documentNodeContextPathSelector);

    // Reload all nodes
    yield put(actions.CR.Nodes.reloadState());

    // Check if the currently focused document node has been removed
    const contentCanvasNodeIsStillThere = Boolean(yield select(selectors.CR.Nodes.byContextPathSelector(currentContentCanvasContextPath)));

    // If it's still there, reload the document
    if (contentCanvasNodeIsStillThere) {
        getGuestFrameDocument().location.reload();
    }
}
