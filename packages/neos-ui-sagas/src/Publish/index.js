import {put, call, select, takeEvery, take, race} from 'redux-saga/effects';

import {actionTypes, actions, selectors} from '@neos-project/neos-ui-redux-store';
import {PublishingMode, PublishingScope} from '@neos-project/neos-ui-redux-store/src/CR/Publishing';
import backend from '@neos-project/neos-ui-backend-connector';
import {getGuestFrameDocument} from '@neos-project/neos-ui-guest-frame/src/dom';

export function * watchPublishing({routes}) {
    const {endpoints} = backend.get();
    const ENDPOINT_BY_MODE_AND_SCOPE = {
        [PublishingMode.PUBLISH]: {
            [PublishingScope.SITE]:
                endpoints.publishChangesInSite,
            [PublishingScope.DOCUMENT]:
                endpoints.publishChangesInDocument
        },
        [PublishingMode.DISCARD]: {
            [PublishingScope.SITE]:
                endpoints.discardChangesInSite,
            [PublishingScope.DOCUMENT]:
                endpoints.discardChangesInDocument
        }
    };
    const SELECTORS_BY_SCOPE = {
        [PublishingScope.SITE]: {
            ancestorIdSelector: selectors.CR.Nodes.siteNodeContextPathSelector,
            publishableNodesSelector: selectors.CR.Workspaces.publishableNodesSelector
        },
        [PublishingScope.DOCUMENT]: {
            ancestorIdSelector: selectors.CR.Nodes.documentNodeContextPathSelector,
            publishableNodesSelector: selectors.CR.Workspaces.publishableNodesInDocumentSelector
        }
    };

    yield takeEvery(actionTypes.CR.Publishing.STARTED, function * publishingWorkflow(action) {
        const confirmed = yield * waitForConfirmation();
        if (!confirmed) {
            return;
        }

        const {scope, mode} = action.payload;
        const endpoint = ENDPOINT_BY_MODE_AND_SCOPE[mode][scope];
        const {ancestorIdSelector, publishableNodesSelector} = SELECTORS_BY_SCOPE[scope];

        let feedback = null;
        let publishableNodes = [];

        try {
            const workspaceName = yield select(selectors.CR.Workspaces.personalWorkspaceNameSelector);
            const ancestorId = yield select(ancestorIdSelector);
            publishableNodes = yield select(publishableNodesSelector);
            feedback = yield call(endpoint, ancestorId, workspaceName)

            yield put(actions.CR.Publishing.succeed());
        } catch (error) {
            console.error('Publishing failed', error);
            yield put(actions.CR.Publishing.fail('Publishing failed'));
        }

        if (feedback !== null) {
            yield put(actions.ServerFeedback.handleServerFeedback(feedback));
        }

        if (mode === PublishingMode.DISCARD) {
            yield * reloadAfterDiscard(publishableNodes, routes);
        }

        yield take(actionTypes.CR.Publishing.ACKNOWLEDGED);
        yield put(actions.CR.Publishing.finish(publishableNodes));
    });
}

function * waitForConfirmation() {
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
