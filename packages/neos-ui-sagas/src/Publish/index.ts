/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */
import {put, call, select, takeEvery, take, race} from 'redux-saga/effects';

import {AnyError} from '@neos-project/neos-ui-error';
import {NodeContextPath, WorkspaceName} from '@neos-project/neos-ts-interfaces';
import {actionTypes, actions, selectors} from '@neos-project/neos-ui-redux-store';
import {GlobalState} from '@neos-project/neos-ui-redux-store/src/System';
import {FeedbackEnvelope} from '@neos-project/neos-ui-redux-store/src/ServerFeedback';
import {PublishingMode, PublishingScope} from '@neos-project/neos-ui-redux-store/src/CR/Publishing';
import {PublishableNode, TypeOfChange, WorkspaceInformation} from '@neos-project/neos-ui-redux-store/src/CR/Workspaces';
import backend, {Routes} from '@neos-project/neos-ui-backend-connector';
// @ts-ignore
import {getGuestFrameDocument} from '@neos-project/neos-ui-guest-frame/src/dom';

const handleWindowBeforeUnload = (event: BeforeUnloadEvent) => {
    event.preventDefault();
    event.returnValue = true;
    return true;
};

type PublishingResponse =
    | { success: unknown }
    | { error: AnyError };

export function * watchPublishing({routes}: {routes: Routes}) {
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

    yield takeEvery(actionTypes.CR.Publishing.STARTED, function * publishingWorkflow(action: ReturnType<typeof actions.CR.Publishing.start>) {
        const confirmed = yield * waitForConfirmation();
        if (!confirmed) {
            return;
        }

        const {scope, mode} = action.payload;
        const endpoint = ENDPOINT_BY_MODE_AND_SCOPE[mode][scope];
        const {ancestorIdSelector, publishableNodesSelector} = SELECTORS_BY_SCOPE[scope];

        const workspaceName: WorkspaceName = yield select(selectors.CR.Workspaces.personalWorkspaceNameSelector);
        const ancestorId: NodeContextPath = yield select(ancestorIdSelector);
        const publishableNodes: PublishableNode[] = yield select(publishableNodesSelector);

        let affectedNodes: PublishableNode[] = [];
        do {
            try {
                window.addEventListener('beforeunload', handleWindowBeforeUnload);
                const result: PublishingResponse = yield call(endpoint, ancestorId, workspaceName);

                if ('success' in result) {
                    affectedNodes = publishableNodes;
                    yield put(actions.CR.Publishing.succeed());

                    if (mode === PublishingMode.DISCARD) {
                        yield * reloadAfterDiscard(publishableNodes, routes);
                    }
                } else if ('error' in result) {
                    yield put(actions.CR.Publishing.fail(result.error));
                } else {
                    yield put(actions.CR.Publishing.fail(null));
                }
            } catch (error) {
                yield put(actions.CR.Publishing.fail(error as AnyError));
            } finally {
                window.removeEventListener('beforeunload', handleWindowBeforeUnload);
            }
        } while (yield * waitForRetry());

        yield put(actions.CR.Publishing.finish(affectedNodes));
    });
}

function * waitForConfirmation() {
    const {confirmed}: {
        cancelled: ReturnType<typeof actions.CR.Publishing.cancel>;
        confirmed: ReturnType<typeof actions.CR.Publishing.confirm>;
    } = yield race({
        cancelled: take(actionTypes.CR.Publishing.CANCELLED),
        confirmed: take(actionTypes.CR.Publishing.CONFIRMED)
    });

    return Boolean(confirmed);
}

function * waitForRetry() {
    const {retried}: {
        acknowledged: ReturnType<typeof actions.CR.Publishing.acknowledge>;
        retried: ReturnType<typeof actions.CR.Publishing.retry>;
    } = yield race({
        acknowledged: take(actionTypes.CR.Publishing.ACKNOWLEDGED),
        retried: take(actionTypes.CR.Publishing.RETRIED)
    });

    return Boolean(retried);
}

function * reloadAfterDiscard(discardedNodes: PublishableNode[], routes: Routes) {
    const currentContentCanvasContextPath: NodeContextPath = yield select(selectors.CR.Nodes.documentNodeContextPathSelector);
    const currentDocumentParentLine: ReturnType<typeof selectors.CR.Nodes.documentNodeParentLineSelector> =
        yield select(selectors.CR.Nodes.documentNodeParentLineSelector);

    const avilableAncestorDocumentNode = currentDocumentParentLine.reduce((prev, cur) => {
        if (prev === null) {
            const hasBeenRemovedByDiscard = discardedNodes.some((discardedNode) => {
                if (discardedNode.contextPath !== cur?.contextPath) {
                    return false;
                }

                return Boolean(
                    discardedNode.typeOfChange
                    & TypeOfChange.NODE_HAS_BEEN_CREATED
                );
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
    const contentCanvasNode: ReturnType<typeof selectors.CR.Nodes.byContextPathSelector> =
        yield select(selectors.CR.Nodes.byContextPathSelector(currentContentCanvasContextPath));
    const contentCanvasNodeIsStillThere = Boolean(contentCanvasNode);

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
    yield takeEvery(actionTypes.CR.Workspaces.CHANGE_BASE_WORKSPACE, function * change(action: ReturnType<typeof actions.CR.Workspaces.changeBaseWorkspace>) {
        try {
            const documentNode: null | string = yield select(
                (state: GlobalState) => state?.cr?.nodes?.documentNode
            );

            if (documentNode) {
                const feedback: FeedbackEnvelope = yield call(changeBaseWorkspace, action.payload, documentNode);
                yield put(actions.ServerFeedback.handleServerFeedback(feedback));

                // Reload the page tree
                yield put(actions.CR.Nodes.reloadState());
            }
        } catch (error) {
            console.error('Failed to change base workspace', error);
        }
    });
}

export function * watchRebaseWorkspace() {
    const {rebaseWorkspace, getWorkspaceInfo} = backend.get().endpoints;
    yield takeEvery(actionTypes.CR.Workspaces.REBASE_WORKSPACE, function * change(action: ReturnType<typeof actions.CR.Workspaces.rebaseWorkspace>) {
        yield put(actions.UI.Remote.startSynchronization());

        try {
            const feedback: FeedbackEnvelope = yield call(rebaseWorkspace, action.payload);
            yield put(actions.ServerFeedback.handleServerFeedback(feedback));
        } catch (error) {
            console.error('Failed to sync user workspace', error);
        } finally {
            const workspaceInfo: WorkspaceInformation = yield call(getWorkspaceInfo);
            yield put(actions.CR.Workspaces.update(workspaceInfo));
            yield put(actions.UI.Remote.finishSynchronization());
        }
    });
}
