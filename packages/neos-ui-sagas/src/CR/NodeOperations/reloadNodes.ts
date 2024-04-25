/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */
import {call, put, select} from 'redux-saga/effects';

import {actions, selectors} from '@neos-project/neos-ui-redux-store';
import {GlobalState} from '@neos-project/neos-ui-redux-store/src/System';
import {DimensionCombination, Node, NodeContextPath, NodeMap, WorkspaceName} from '@neos-project/neos-ts-interfaces';
import {AnyError} from '@neos-project/neos-ui-error';
import backend from '@neos-project/neos-ui-backend-connector';
// @ts-ignore
import {getGuestFrameDocument} from '@neos-project/neos-ui-guest-frame/src/dom';

// @TODO: This is a helper to gain type access to the available backend endpoints.
// It shouldn't be necessary to do this, and this hack should be removed once a
// better type API is available
import {default as Endpoints, Routes} from '@neos-project/neos-ui-backend-connector/src/Endpoints';
type Endpoints = ReturnType<typeof Endpoints>;

type ReloadNodesResponse =
    | {
        success: {
            documentId: NodeContextPath;
            nodes: NodeMap;
        }
    }
    | {error: AnyError}

export const makeReloadNodes = (deps: {
    routes?: Routes;
}) => {
    const redirectToDefaultModule = makeRedirectToDefaultModule(deps);
    const {reloadNodes: reloadNodesEndpoint} = backend.get().endpoints as Endpoints;

    return function * reloadNodes() {
        const workspaceName: WorkspaceName = yield select<GlobalState>(
            (state) => state.cr.workspaces.personalWorkspace.name
        );
        const dimensionSpacePoint: DimensionCombination = yield select<GlobalState>(
            (state) => state.cr.contentDimensions.active
        );
        const {siteNode: siteId, documentNode: documentId}: GlobalState['cr']['nodes'] =
            yield select<GlobalState>((state) => state.cr.nodes);
        if (!siteId || !documentId) {
            redirectToDefaultModule();
            return;
        }

        const documentNodeParentLine: ReturnType<
            typeof selectors.CR.Nodes.documentNodeParentLineSelector
        > = yield select<GlobalState>(selectors.CR.Nodes.documentNodeParentLineSelector);
        const ancestorsOfDocumentIds = documentNodeParentLine
            .map((nodeOrNull) => nodeOrNull?.contextPath)
            .filter((nodeIdOrNull) => Boolean(nodeIdOrNull)) as NodeContextPath[];
        const clipboardNodesIds: NodeContextPath[] = yield select<GlobalState>(
            selectors.CR.Nodes.clipboardNodesContextPathsSelector
        );
        const toggledNodesIds: NodeContextPath[] = yield select<GlobalState>(
            state => state?.ui?.pageTree?.toggled
        );

        yield put(actions.UI.PageTree.setAsLoading(siteId));

        const result: ReloadNodesResponse = yield call(reloadNodesEndpoint, {
            workspaceName,
            dimensionSpacePoint,
            siteId,
            documentId,
            ancestorsOfDocumentIds,
            clipboardNodesIds,
            toggledNodesIds
        });

        if ('success' in result) {
            yield put(actions.CR.Nodes.setState({
                siteNodeContextPath: siteId,
                documentNodeContextPath: result.success.documentId,
                nodes: result.success.nodes,
                merge: false
            }));

            yield put(actions.UI.PageTree.setAsLoaded(siteId));

            if (documentId === result.success.documentId) {
                // If the document is still available, reload the guest frame
                getGuestFrameDocument().location.reload();
            } else {
                // If it's gone try to navigate to the next available ancestor document
                const availableAncestorDocumentNode: Node = yield select<GlobalState>(
                    selectors.CR.Nodes.byContextPathSelector(result.success.documentId)
                );

                if (availableAncestorDocumentNode) {
                    yield put(actions.CR.Nodes.setDocumentNode(availableAncestorDocumentNode.contextPath));
                    yield put(actions.UI.ContentCanvas.setSrc(availableAncestorDocumentNode.uri));
                } else {
                    // We're doomed - there's no document left to navigate to
                    // In this (rather unlikely) case, we leave the UI and navigate
                    // to whatever default entry module is configured:
                    redirectToDefaultModule();
                }
            }
        } else {
            // If reloading failed on the server side, one of three things happened:
            // 1. No document node could be found
            // 2. No site node could be found
            // 3. Some other, more profound error occurred
            //
            // No matter which scenario, we'd end up in an invalid UI state. This is
            // why we need to escape to whatever default entry module is configured:
            redirectToDefaultModule();
        }
    };
}

const makeRedirectToDefaultModule = (deps: {
    routes?: Routes;
}) => {
    return function redirectToDefaultModule() {
        window.location.href = deps.routes?.core?.modules?.defaultModule!;
    };
};
