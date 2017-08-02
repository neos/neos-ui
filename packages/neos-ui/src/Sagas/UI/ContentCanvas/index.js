import {takeLatest} from 'redux-saga';
import {put, select} from 'redux-saga/effects';
import {$get} from 'plow-js';
import {getGuestFrameDocument} from '@neos-project/neos-ui-guest-frame/src/dom';

import {actionTypes, actions} from '@neos-project/neos-ui-redux-store';

/**
 * Observe the creation of a node
 */
function * watchNodeCreate() {
    yield * takeLatest(actionTypes.UI.NodeCreationDialog.APPLY, function * nodeCreationStarted() {
        yield put(actions.UI.ContentCanvas.documentInitializing());
    });
}

/**
 * Load newly created page into canvas
 */
function * watchNodeCreated() {
    yield * takeLatest(actionTypes.UI.Remote.DOCUMENT_NODE_CREATED, function * nodeCreated(action) {
        const {contextPath} = action.payload;
        const node = yield select($get(['cr', 'nodes', 'byContextPath', contextPath]));
        yield put(actions.UI.ContentCanvas.setContextPath(contextPath));
        yield put(actions.UI.ContentCanvas.setSrc($get('uri', node)));
    });
}
/**
 * Load newly created page into canvas
 */
function * watchCanvasUpdateToChangeTitle() {
    yield * takeLatest(actionTypes.UI.ContentCanvas.DOCUMENT_INITIALIZED, () => {
        document.title = getGuestFrameDocument().title;
    });
}

/**
 * Run initialization sequence, after a new document has been loaded
 */
function * watchDocumentInitialized({globalRegistry, store}) {
    const guestFrameRegistry = globalRegistry.get('@neos-project/neos-ui-guest-frame');
    const makeInitializeGuestFrame = guestFrameRegistry.get('makeInitializeGuestFrame');

    yield * takeLatest(
        actionTypes.UI.ContentCanvas.DOCUMENT_INITIALIZED,
        makeInitializeGuestFrame({globalRegistry, store})
    );
}

export const sagas = [
    watchNodeCreate,
    watchNodeCreated,
    watchCanvasUpdateToChangeTitle,
    watchDocumentInitialized
];
