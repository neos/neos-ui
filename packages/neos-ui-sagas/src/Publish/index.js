import {put, call, select, takeEvery, takeLatest, take, race} from 'redux-saga/effects';

import {actionTypes, actions, selectors} from '@neos-project/neos-ui-redux-store';
import {PublishingMode, PublishingScope} from '@neos-project/neos-ui-redux-store/src/CR/Publishing';
import backend from '@neos-project/neos-ui-backend-connector';
import {getGuestFrameDocument} from '@neos-project/neos-ui-guest-frame/src/dom';

export function * watchPublish() {
    const {publishChangesInSite, publishChangesInDocument} = backend.get().endpoints;

    yield takeEvery(actionTypes.CR.Publishing.STARTED, function * publishNodes(action) {
        const {scope, mode} = action.payload;
        if (mode !== PublishingMode.PUBLISH) {
            return;
        }

        const workspaceName = yield select(selectors.CR.Workspaces.personalWorkspaceNameSelector);

        if (yield * confirm()) {
            let feedback = null;
            let publishedNodes = [];
            try {
                if (scope === PublishingScope.SITE) {
                    const siteId = yield select(selectors.CR.Nodes.siteNodeContextPathSelector);
                    publishedNodes = yield select(selectors.CR.Workspaces.publishableNodesSelector);
                    feedback = yield call(publishChangesInSite, siteId, workspaceName);
                } else if (scope === PublishingScope.DOCUMENT) {
                    const documentId = yield select(selectors.CR.Nodes.documentNodeContextPathSelector);
                    publishedNodes = yield select(selectors.CR.Workspaces.publishableNodesInDocumentSelector);
                    feedback = yield call(publishChangesInDocument, documentId, workspaceName);
                }
                yield put(actions.CR.Publishing.succeed());
            } catch (error) {
                console.error('Failed to publish', error);
                yield put(actions.CR.Publishing.fail('Failed to Publish'));
            }

            if (feedback !== null) {
                yield put(actions.ServerFeedback.handleServerFeedback(feedback));
            }

            yield take(actionTypes.CR.Publishing.ACKNOWLEDGED);
            yield put(actions.CR.Publishing.finish(publishedNodes));
        }
    });
}

function * confirm() {
    const waitForNextAction = yield race([
        take(actionTypes.CR.Publishing.CANCELLED),
        take(actionTypes.CR.Publishing.CONFIRMED)
    ]);
    const [nextAction] = Object.values(waitForNextAction);

    if (nextAction.type === actionTypes.CR.Publishing.CONFIRMED) {
        return true;
    }

    return false;
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

export function * discardIfConfirmed({routes}) {
    yield takeLatest(actionTypes.CR.Publishing.STARTED, function * waitForConfirmation(action) {
        const {mode} = action.payload;
        if (mode !== PublishingMode.DISCARD) {
            return;
        }

        if (yield * confirm()) {
            yield * discard(action.payload.scope, routes);
        }
    });
}

function * discard(scope, routes) {
    const {discardChangesInSite, discardChangesInDocument} = backend.get().endpoints;
    const workspaceName = yield select(selectors.CR.Workspaces.personalWorkspaceNameSelector);

    let feedback = null;
    let discardedNodes = [];
    try {
        if (scope === PublishingScope.SITE) {
            const siteId = yield select(selectors.CR.Nodes.siteNodeContextPathSelector);
            discardedNodes = yield select(selectors.CR.Workspaces.publishableNodesSelector);
            feedback = yield call(discardChangesInSite, siteId, workspaceName);
        } else if (scope === PublishingScope.DOCUMENT) {
            const documentId = yield select(selectors.CR.Nodes.documentNodeContextPathSelector);
            discardedNodes = yield select(selectors.CR.Workspaces.publishableNodesInDocumentSelector);
            feedback = yield call(discardChangesInDocument, documentId, workspaceName);
        }
        yield put(actions.CR.Publishing.succeed());
    } catch (error) {
        console.error('Failed to discard', error);
        yield put(actions.CR.Publishing.fail('Failed to discard'));
    }

    if (feedback !== null) {
        yield put(actions.ServerFeedback.handleServerFeedback(feedback));
    }

    yield * reloadAfterDiscard(discardedNodes, routes);

    yield take(actionTypes.CR.Publishing.ACKNOWLEDGED);
    yield put(actions.CR.Publishing.finish(discardedNodes));
}

const NODE_HAS_BEEN_CREATED = 0b0001;

function * reloadAfterDiscard(discardedNodes, routes) {
    const currentContentCanvasContextPath = yield select(selectors.CR.Nodes.documentNodeContextPathSelector);
    const currentDocumentParentLine = yield select(selectors.CR.Nodes.documentNodeParentLineSelector);

    const avilableAncestorDocumentNode = currentDocumentParentLine.reduce((prev, cur) => {
        if (prev === null) {
            const hasBeenRemovedByDiscard = discardedNodes.some((discardedNode) => {
                if (discardedNode.contextPath !== cur.contextPath) {
                    return false;
                }

                return Boolean(discardedNode.typeOfChange & NODE_HAS_BEEN_CREATED);
            });

            if (!hasBeenRemovedByDiscard) {
                return cur;
            }
        }

        return prev;
    }, null);

    if (avilableAncestorDocumentNode === null) {
        // We're doomed - there's no document left to navigate to
        // In this (rather unlikely) case, we leave the UI and navigate
        // to whatever default entry module is configured:
        window.location.href = routes?.core?.modules?.defaultModule;
        return;
    }

    // Reload all nodes aaand...
    yield put(actions.CR.Nodes.reloadState({
        documentNodeContextPath: avilableAncestorDocumentNode.contextPath
    }));
    // wait for it.
    yield take(actionTypes.CR.Nodes.RELOAD_STATE_FINISHED);

    // Check if the currently focused document node has been removed
    const contentCanvasNodeIsStillThere = Boolean(yield select(selectors.CR.Nodes.byContextPathSelector(currentContentCanvasContextPath)));

    if (contentCanvasNodeIsStillThere) {
        // If it's still there, reload the document
        getGuestFrameDocument().location.reload();
    } else {
        // If it's gone navigate to the next available ancestor document
        yield put(actions.UI.ContentCanvas.setSrc(avilableAncestorDocumentNode.uri));
    }
}
