import {takeEvery} from 'redux-saga';
import {put, fork} from 'redux-saga/effects';
import {$get} from 'plow-js';

import {actionTypes, actions} from 'Host/Redux/index';
import {CR} from 'Host/Selectors/index';

const getNode = CR.Nodes.byContextPathSelector;
const currentDocumentNode = CR.Nodes.currentDocumentNode;
const imageByUuid = CR.Images.imageByUuid;

import {loadImageMetadata, createImageVariant, uploadAsset} from '../../../../API/Endpoints/index';

function* loadImage(imageValue, state) {
    if (!imageValue || !imageValue.__identity) {
        return;
    }
    const loadedImageInStore = imageByUuid(imageValue.__identity);
    if (loadedImageInStore(state)) {
        // do nothing
    } else {
        yield put(actions.CR.Images.startLoading(imageValue.__identity));
        const r = yield loadImageMetadata(imageValue.__identity);
        yield put(actions.CR.Images.finishLoading(imageValue.__identity, r));
    }
}

export function* watchInspectorNodeChange(getState) {
    // TODO: needs to be triggered after init
    yield* takeEvery([actionTypes.System.BOOT, actionTypes.CR.Nodes.FOCUS, actionTypes.CR.Nodes.BLUR], function* focusChanged(action) {
        const state = getState();

        // TODO: the following is not really nice, as the current node can be "blurred". Maybe we should get rid of this "blur"??
        const focusedNodeContextPath = (action.type === actionTypes.CR.Nodes.FOCUS ? action.payload.contextPath : currentDocumentNode(state));
        const selectedNode = getNode(focusedNodeContextPath)(state);

        const propertyNames = Object.keys(selectedNode.nodeType.properties);
        for (const i in propertyNames) {
            // TODO: generalize!
            if (selectedNode.nodeType.properties[propertyNames[i]].type === 'TYPO3\\Media\\Domain\\Model\\ImageInterface') {
                yield fork(loadImage, selectedNode.properties[propertyNames[i]], state);
            }
        }
    });
}

export function* watchPropertyChangeInInspector(getState) {
    yield* takeEvery([actionTypes.UI.Inspector.WRITE_VALUE], function* watchPropertyChange(action) {
        const state = getState();

        const focusedNodeContextPath = action.payload.nodeContextPath;
        const selectedNode = getNode(focusedNodeContextPath)(state);

        const propertyNames = [action.payload.propertyId];
        for (const i in propertyNames) {
            // TODO: generalize!
            if (selectedNode.nodeType.properties[propertyNames[i]].type === 'TYPO3\\Media\\Domain\\Model\\ImageInterface') {
                yield fork(loadImage, action.payload.value, state);
            }
        }
    });
}

function* uploadImage(uploadImageAction) {
    yield uploadAsset(uploadImageAction.payload.fileToUpload);
}

export function* watchUploadImage() {
    yield* takeEvery([actionTypes.UI.Editors.Image.UPLOAD_IMAGE], function* watchUploadImage(action) {
        yield fork(uploadImage, action);
    });
}

const getTransientInspectorValues = $get(['ui', 'inspector', 'valuesByNodePath']);
function* applyImageChange(value, nodeContextPath, state) {
    const imageUuid = (value && $get('__identity', value));
    if (!imageUuid) {
        return value;
    }

    const transientValuesByNodePath = $get('ui.inspector.valuesByNodePath', state);
    const transientImage = $get([nodeContextPath, 'images', imageUuid], transientValuesByNodePath);

    if (!transientImage) {
        return value;
    }

    const originalImageUuid = $get('object.originalAsset.__identity', transientImage);
    const adjustments = $get('object.adjustments', transientImage).toJS();

    return yield createImageVariant(originalImageUuid, adjustments);
}

export function* applyInspectorState(getState) {
    yield* takeEvery(actionTypes.UI.Inspector.APPLY, function* applyAllChanges(action) {
        const state = getState();
        const {nodeContextPath} = action.payload;
        const selectedNode = getNode(nodeContextPath)(state);

        const transientNodeInspectorValues = $get([nodeContextPath, 'nodeProperties'], getTransientInspectorValues(state));

        for (const key of Object.keys(transientNodeInspectorValues.toJS())) {
            let value = $get([key], transientNodeInspectorValues);

            // TODO: generalize!
            if (selectedNode.nodeType.properties[key].type === 'TYPO3\\Media\\Domain\\Model\\ImageInterface') {
                value = yield applyImageChange(value, nodeContextPath, state);
            }

            yield put(actions.Changes.persistChange({
                type: 'PackageFactory.Guevara:Property',
                subject: nodeContextPath,
                payload: {
                    propertyName: key,
                    value
                }
            }));
        }
        yield put(actions.UI.Inspector.applyFinished(nodeContextPath));
    });
}
