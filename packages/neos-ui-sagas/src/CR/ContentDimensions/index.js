import {put, select, race, take, takeLatest, takeEvery, call} from 'redux-saga/effects';
import {$get} from 'plow-js';

import {actions, actionTypes, selectors} from '@neos-project/neos-ui-redux-store';
import backend from '@neos-project/neos-ui-backend-connector';

/**
 * Watch for the user's request to change a dimension. And then:
 *
 * 1. Make sure, the current content canvas node exists in the target dimension
 * by either loading it or offer the user a workflow to create it.
 *
 * 2. Load the node in the target dimension into the content canvas.
 *
 * 3. Load all default nodes needed for the tree
 */
export function * watchSelectPreset() {
    yield takeLatest(actionTypes.CR.ContentDimensions.SET_ACTIVE, function * () {
        const sourceDimensions = yield select(selectors.CR.ContentDimensions.active);

        while (true) { // eslint-disable-line no-constant-condition
            yield take(actionTypes.CR.ContentDimensions.SELECT_PRESET);
            const targetDimensions = yield select(selectors.CR.ContentDimensions.active);
            const currentContentCanvasNode = yield select(selectors.CR.Nodes.documentNodeSelector);
            const currentContentCanvasNodeIdentifier = $get('identifier', currentContentCanvasNode);

            const informationAboutNodeInTargetDimension = yield call(ensureNodeInSelectedDimension, {
                nodeIdentifier: currentContentCanvasNodeIdentifier,
                sourceDimensions,
                targetDimensions
            });

            if (!informationAboutNodeInTargetDimension) {
                yield put(actions.CR.ContentDimensions.setActive(sourceDimensions));
                continue;
            }

            const {nodeContextPath, nodeFrontendUri} = informationAboutNodeInTargetDimension;
            yield put(actions.UI.ContentCanvas.setSrc(nodeFrontendUri));
            yield put(actions.UI.PageTree.focus(nodeContextPath));
        }
    });
}

/**
 * Watch for dimension changes and then reload state
 */
export function * watchSetActive() {
    let previousActiveDimensions = yield select(selectors.CR.ContentDimensions.active);
    yield takeEvery(actionTypes.CR.ContentDimensions.SET_ACTIVE, function * () {
        const activeDimensions = yield select(selectors.CR.ContentDimensions.active);
        if (previousActiveDimensions && JSON.stringify(activeDimensions) !== JSON.stringify(previousActiveDimensions)) {
            yield put(actions.CR.Nodes.reloadState({merge: true}));
        }
        previousActiveDimensions = activeDimensions;
    });
}

/**
 * Make sure, that the given nodeidentifier has a representation in the target dimension.
 * If not: Ask the user to either create an empty node or to copy the given node.
 */
function * ensureNodeInSelectedDimension({nodeIdentifier, sourceDimensions, targetDimensions}) {
    const {getWorkspaceInfo} = backend.get().endpoints;
    const {
        getSingleNode,
        adoptNodeToOtherDimension
    } = backend.get().endpoints;
    const currentWorkspaceName = yield select($get('cr.workspaces.personalWorkspace.name'));

    const {
        nodeFound,
        nodeFrontendUri,
        nodeContextPath,
        numberOfNodesMissingOnRootline
    } = yield getSingleNode(nodeIdentifier, {
        dimensions: targetDimensions,
        workspaceName: currentWorkspaceName
    });

    if (nodeFound) {
        return {nodeFrontendUri, nodeContextPath};
    }

    yield put(actions.UI.NodeVariantCreationDialog.open(numberOfNodesMissingOnRootline));

    const waitForNextAction = yield race([
        take(actionTypes.UI.NodeVariantCreationDialog.CANCEL),
        take(actionTypes.UI.NodeVariantCreationDialog.CREATE_EMPTY),
        take(actionTypes.UI.NodeVariantCreationDialog.CREATE_AND_COPY)
    ]);
    const nextAction = Object.values(waitForNextAction)[0];

    if (nextAction.type !== actionTypes.UI.NodeVariantCreationDialog.CANCEL) {
        const copyContent = nextAction.type === actionTypes.UI.NodeVariantCreationDialog.CREATE_AND_COPY;
        const {nodeFrontendUri, nodeContextPath} = yield adoptNodeToOtherDimension({
            identifier: nodeIdentifier,
            workspaceName: currentWorkspaceName,
            targetDimensions,
            sourceDimensions,
            copyContent
        });

        const workspaceInfo = yield call(getWorkspaceInfo);
        yield put(actions.CR.Workspaces.update(workspaceInfo));

        return {nodeFrontendUri, nodeContextPath};
    }
}
