import {takeEvery} from 'redux-saga';
import {take, race, put, call, select} from 'redux-saga/effects';
import {$get} from 'plow-js';

import {actionTypes, actions} from 'Host/Redux/index';
import {CR} from 'Host/Selectors/index';

import initializeInspectorViewConfiguration from './initializeInspectorViewConfiguration';

const getNode = CR.Nodes.byContextPathSelector;
const getFocusedNode = CR.Nodes.focusedSelector;
const currentDocumentNode = CR.Nodes.currentDocumentNode;
const imageByUuid = CR.Images.imageByUuid;
const getTransientInspectorValues = state => {
    const values = $get(['ui', 'inspector', 'valuesByNodePath'], state);

    return values.toJS ? values.toJS() : values;
};

const getEditorNamefromNodeProperty = key => $get(['nodeType', 'properties', key, 'ui', 'inspector', 'editor']);

import {loadImageMetadata, createImageVariant, uploadAsset} from 'API/Endpoints/index';

export function* inspectorSaga() {
    yield take(actionTypes.System.READY);

    while(true) {
        const state = yield select();
        const focusedNode = getFocusedNode(state);

        //
        // Read the configuration for editors from the ui configuration of the focused nodes
        // node type and prepare it to be rendered through the Inspector Component
        //
        const viewConfiguration = yield call(initializeInspectorViewConfiguration, focusedNode);

        //
        // Inform the inspector of the loaded configuration
        //
        yield put(actions.UI.Inspector.load(viewConfiguration, focusedNode.contextPath));

        //
        // Wait for the user to focus another node, to discard all transient
        // changes or to apply his/her changes,
        //
        while(true) {
            const nextAction = yield race([
                actionTypes.CR.Nodes.FOCUS,
                actionTypes.UI.Inspector.DISCARD,
                actionTypes.UI.Inspector.APPLY
            ]);

            //
            // If the user focused a different node, just continue
            //
            if (nextAction.type === actionTypes.CR.Nodes.FOCUS) {
                break;
            }

            //
            // If the user discarded his/her changes, just continue
            //
            if (nextAction.type === actionTypes.UI.Inspector.DISCARD) {
                break;
            }

            //
            // If the user wants to apply his/her changes, let's start that process
            //
            if (nextAction.type === actionTypes.UI.Inspector.APPLY) {
                try {
                    //
                    // Persist the inspector changes
                    //
                    yield call(flushInspector);
                } catch (err) {
                    //
                    // An error occured, we should not leave the loop until
                    // the user does something about it
                    //
                    continue;
                }

                break;
            }
        }
    }
}

function* flushInspector() {
    const state = yield select();
    const focusedNode = getFocusedNode(state);
    const transientInspectorValues = getTransientInspectorValues(state);
    const registry = yield injectConfiguration(inspectorEditorRegistry);

    for (const key of Object.keys(transientInspectorValues)) {
        const getEditorNameFromNode = getEditorNamefromNodeProperty(key);
        const editorName = getEditorNameFromNode(focusedNode);
        const editor = yield registry.get(editorName);
        const value = yield editor.postProcess ? editor.postProcess(value) : value;

        yield put(actions.Changes.persistChange({
            type: 'PackageFactory.Guevara:Property',
            subject: focusedNode.contextPath,
            payload: {
                propertyName: key,
                value
            }
        }));
    }
}

// function* loadImage(imageValue, state) {
//     if (!imageValue || !imageValue.__identity) {
//         return;
//     }
//     const loadedImageInStore = imageByUuid(imageValue.__identity);
//     if (loadedImageInStore(state)) {
//         // do nothing
//     } else {
//         yield put(actions.CR.Images.startLoading(imageValue.__identity));
//         const r = yield loadImageMetadata(imageValue.__identity);
//         yield put(actions.CR.Images.finishLoading(imageValue.__identity, r));
//     }
// }
//
// export function* watchInspectorNodeChange() {
//     // TODO: needs to be triggered after init
//     yield* takeEvery([actionTypes.System.BOOT, actionTypes.CR.Nodes.FOCUS, actionTypes.CR.Nodes.BLUR], function* focusChanged(action) {
//         const state = yield select();
//
//         // TODO: the following is not really nice, as the current node can be "blurred". Maybe we should get rid of this "blur"??
//         const focusedNodeContextPath = (action.type === actionTypes.CR.Nodes.FOCUS ? action.payload.contextPath : currentDocumentNode(state));
//         const selectedNode = getNode(focusedNodeContextPath)(state);
//
//         const propertyNames = Object.keys($get('nodeType.properties', selectedNode));
//         for (const i in propertyNames) {
//             // TODO: generalize!
//             if ($get(['nodeType', 'properties', propertyNames[i], 'type'], selectedNode) === 'TYPO3\\Media\\Domain\\Model\\ImageInterface') {
//                 yield fork(loadImage, $get(['properties', propertyNames[i]], selectedNode), state);
//             }
//         }
//     });
// }
//
// export function* watchPropertyChangeInInspector() {
//     yield* takeEvery([actionTypes.UI.Inspector.WRITE_VALUE], function* watchPropertyChange(action) {
//         const state = yield select();
//
//         const focusedNodeContextPath = action.payload.nodeContextPath;
//         const selectedNode = getNode(focusedNodeContextPath)(state);
//
//         const propertyNames = [action.payload.propertyId];
//         for (const i in propertyNames) {
//             // TODO: generalize!
//             if ($get(['nodeType', 'properties', propertyNames[i], 'type'], selectedNode) === 'TYPO3\\Media\\Domain\\Model\\ImageInterface') {
//                 yield fork(loadImage, action.payload.value, state);
//             }
//         }
//     });
// }
//
// export function* watchUploadImage() {
//     yield* takeEvery([actionTypes.UI.Editors.Image.UPLOAD_IMAGE], function* watchUploadImage(action) {
//         const state = yield select();
//         const siteNodePath = $get('cr.nodes.siteNode', state);
//         const siteNodeName = siteNodePath.match(/\/sites\/([^/@]*)/)[1];
//
//         yield fork(function* () {
//             const imageMetadata = yield uploadAsset(action.payload.fileToUpload, siteNodeName);
//             const imageUuid = $get('object.__identity', imageMetadata);
//
//             yield put(actions.CR.Images.finishLoading(imageUuid, imageMetadata));
//             yield put(actions.UI.Editors.Image.finishImageUpload());
//             action.payload.nodePropertyValueChangeFn({__identity: imageUuid});
//         }, action);
//     });
// }
//
// function* applyImageChange(value, nodeContextPath, state) {
//     const imageUuid = (value && $get('__identity', value));
//     if (!imageUuid) {
//         return value;
//     }
//
//     const transientValuesByNodePath = $get('ui.inspector.valuesByNodePath', state);
//     const transientImage = $get([nodeContextPath, 'images', imageUuid], transientValuesByNodePath);
//
//     if (!transientImage) {
//         return value;
//     }
//
//     const originalImageUuid = $get('object.originalAsset.__identity', transientImage) || $get('object.__identity', transientImage);
//     const adjustments = $get('object.adjustments', transientImage).toJS();
//
//     return yield createImageVariant(originalImageUuid, adjustments);
// }
//
// export function* applyInspectorState() {
//     yield* takeEvery(actionTypes.UI.Inspector.APPLY, function* applyAllChanges(action) {
//         const state = yield select();
//         const {nodeContextPath} = action.payload;
//         const selectedNode = getNode(nodeContextPath)(state);
//
//         const transientNodeInspectorValues = $get([nodeContextPath, 'nodeProperties'], getTransientInspectorValues(state));
//
//         for (const key of Object.keys(transientNodeInspectorValues.toJS())) {
//             const value = yield inspectorEditorRegistry.postProcess(
//                 selectedNode,
//                 $get(['nodeType', 'properties', key], selectedNode),
//                 $get([key], transientNodeInspectorValues)
//             );
//
//             yield put(actions.Changes.persistChange({
//                 type: 'PackageFactory.Guevara:Property',
//                 subject: nodeContextPath,
//                 payload: {
//                     propertyName: key,
//                     value
//                 }
//             }));
//         }
//         yield put(actions.UI.Inspector.applyFinished(nodeContextPath));
//     });
// }
