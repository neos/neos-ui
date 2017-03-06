import {takeLatest} from 'redux-saga';
import {put, select, race, take} from 'redux-saga/effects';
import {$get} from 'plow-js';

import {actions, actionTypes, selectors} from '@neos-project/neos-ui-redux-store';
import backend from '@neos-project/neos-ui-backend-connector';
function * watchSelectPreset() {
    // Only process the latest selection and cancel previous ones
    yield * takeLatest(actionTypes.CR.ContentDimensions.SELECT_PRESET, updateContentCanvasSrc);
}
function * updateContentCanvasSrc(action) {
    const previousPresetName = action.payload.previousPresetName;
    const changedDimensionName = action.payload.name;

    const activeDimensions = yield select(selectors.CR.ContentDimensions.active);
    const currentWorkspaceName = yield select($get('cr.workspaces.personalWorkspace.name'));

    const currentContentCanvasNode = yield select(selectors.CR.Nodes.currentContentCanvasNodeSelector);
    const currentContentCanvasNodeIdentifier = $get('identifier', currentContentCanvasNode);

    const result = yield backend.get().endpoints.getSingleNode(currentContentCanvasNodeIdentifier, {
        dimensions: activeDimensions.toJS(),
        workspaceName: currentWorkspaceName
    });

    if (result.nodeFound) {
        yield put(actions.UI.ContentCanvas.setSrc(result.nodeFrontendUri));
    } else {
        yield put(actions.UI.NodeVariantCreationDialog.open(result.numberOfNodesMissingOnRootline));

        const sourceDimensions = activeDimensions.toJS();
        const dimensionsByName = yield select(selectors.CR.ContentDimensions.byName);
        sourceDimensions[changedDimensionName] = $get([changedDimensionName, 'presets', previousPresetName, 'values'], dimensionsByName).toJS();

        const waitForNextAction = yield race([
            take(actionTypes.UI.NodeVariantCreationDialog.CANCEL),
            take(actionTypes.UI.NodeVariantCreationDialog.CREATE_EMPTY),
            take(actionTypes.UI.NodeVariantCreationDialog.CREATE_AND_COPY)
        ]);
        const nextAction = Object.values(waitForNextAction)[0];

        if (nextAction.type === actionTypes.UI.NodeVariantCreationDialog.CREATE_EMPTY) {
            const result = yield backend.get().endpoints.adoptNodeToOtherDimension({
                identifier: currentContentCanvasNodeIdentifier,
                targetDimensions: activeDimensions.toJS(),
                sourceDimensions,
                workspaceName: currentWorkspaceName,
                copyContent: false
            });
            yield put(actions.UI.ContentCanvas.setSrc(result.nodeFrontendUri));
        } else if (nextAction.type === actionTypes.UI.NodeVariantCreationDialog.CREATE_AND_COPY) {
            const result = yield backend.get().endpoints.adoptNodeToOtherDimension({
                identifier: currentContentCanvasNodeIdentifier,
                targetDimensions: activeDimensions.toJS(),
                sourceDimensions,
                workspaceName: currentWorkspaceName,
                copyContent: true
            });
            yield put(actions.UI.ContentCanvas.setSrc(result.nodeFrontendUri));
        } else if (nextAction.type === actionTypes.UI.NodeVariantCreationDialog.CANCEL) {
            // Select old dimensions again if user cancelled
            yield put(actions.CR.ContentDimensions.setActive(sourceDimensions));
        }
    }
}

export const sagas = [
    watchSelectPreset
];
