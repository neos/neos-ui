import {put, select, race, take, call} from 'redux-saga/effects';
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
function * watchSelectPreset({configuration}) {
    yield take(actionTypes.System.READY);

    let sourceDimensions = yield select(selectors.CR.ContentDimensions.active);

    while (true) { // eslint-disable-line no-constant-condition
        yield take(actionTypes.CR.ContentDimensions.SELECT_PRESET);
        const targetDimensions = yield select(selectors.CR.ContentDimensions.active);
        const currentContentCanvasNode = yield select(selectors.CR.Nodes.currentContentCanvasNodeSelector);
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

        const {nodeFrontendUri, nodeContextPath} = informationAboutNodeInTargetDimension;

        const {q} = backend.get();
        const siteNode = yield select(selectors.CR.Nodes.siteNodeSelector);
        const siteNodeContextPath = $get('contextPath', siteNode);
        const targetSiteNodeContextPath = `${siteNodeContextPath.split('@')[0]}@${nodeContextPath.split('@')[1]}`;

        yield put(actions.UI.ContentCanvas.setSrc(nodeFrontendUri));
        const nodes = yield q([targetSiteNodeContextPath, nodeContextPath]).neosUiDefaultNodes(
            configuration.nodeTree.presets.default.baseNodeType,
            configuration.nodeTree.loadingDepth
        ).get();

        yield put(actions.CR.Nodes.switchDimension({
            siteNodeContextPath: targetSiteNodeContextPath,
            documentNodeContextPath: nodeContextPath,
            nodes: nodes.reduce((nodes, node) => {
                nodes[node.contextPath] = node;
                return nodes;
            }, {})
        }));

        sourceDimensions = targetDimensions;
    }
}

/**
 * Make sure, that the given nodeidentifier has a representation in the target dimension.
 * If not: Ask the user to either create an empty node or to copy the given node.
 */
function * ensureNodeInSelectedDimension({nodeIdentifier, sourceDimensions, targetDimensions}) {
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
        dimensions: targetDimensions.toJS(),
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

        return {nodeFrontendUri, nodeContextPath};
    }
}

export const sagas = [
    watchSelectPreset
];
