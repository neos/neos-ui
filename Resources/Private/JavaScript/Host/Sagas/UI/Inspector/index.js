import {takeLatest, takeEvery} from 'redux-saga';
import {put, fork} from 'redux-saga/effects';
import {$get, $transform} from 'plow-js';

import {actionTypes, actions} from 'Host/Redux/index';
import {CR} from 'Host/Selectors/index';

const getNode = CR.Nodes.byContextPathSelector;
const currentDocumentNode = CR.Nodes.currentDocumentNode;
const imageByUuid = CR.Images.imageByUuid;

import {loadImageMetadata} from 'API/Endpoints/index';


function* loadImage(imageValue, state) {
    if (!imageValue) {
        return;
    }
    const loadedImageInStore = imageByUuid(imageValue.__identity);
    if (loadedImageInStore(state)) {
        // do nothing
    } else {
        yield put(actions.CR.Images.startLoading(imageValue.__identity));
        const r = yield loadImageMetadata(imageValue.__identity);
        yield put(actions.CR.Images.finishLoading(imageValue.__identity, r));
        console.log("LOADED IMAGE", imageValue.__identity);
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
        };
    });
}
