import {takeLatest, delay} from 'redux-saga';
import {put, select, take, race} from 'redux-saga/effects';
import {$get} from 'plow-js';
import {getGuestFrameDocument} from '@neos-project/neos-ui-guest-frame/src/dom';

import {actionTypes, actions} from '@neos-project/neos-ui-redux-store';

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
    yield * takeLatest(actionTypes.UI.ContentCanvas.STOP_LOADING, () => {
        document.title = getGuestFrameDocument().title;
    });
}

/**
 * Run initialization sequence, after a new document has been loaded
 */
function * watchStopLoading({globalRegistry, store}) {
    const guestFrameRegistry = globalRegistry.get('@neos-project/neos-ui-guest-frame');
    const makeInitializeGuestFrame = guestFrameRegistry.get('makeInitializeGuestFrame');

    yield * takeLatest(
        actionTypes.UI.ContentCanvas.STOP_LOADING,
        makeInitializeGuestFrame({globalRegistry, store})
    );
}

function * watchControlOverIFrame() {
    yield take(actionTypes.System.READY);

    while (true) { //eslint-disable-line
        const src = yield select($get('ui.contentCanvas.src'));
        const waitForNextAction = yield race([
            take(actionTypes.UI.ContentCanvas.SET_SRC),
            take(actionTypes.UI.ContentCanvas.REQUEST_REGAIN_CONTROL)
        ]);
        const nextAction = Object.keys(waitForNextAction).map(k => waitForNextAction[k])[0];

        if (nextAction.type === actionTypes.UI.ContentCanvas.REQUEST_REGAIN_CONTROL) {
            yield put(actions.UI.FlashMessages.add('iframe access', nextAction.payload.errorMessage, 'error', 5000));

            //
            // We need to delay, so that the iframe gets cleared before we load a new src
            //
            yield delay(0);
            yield put(actions.UI.ContentCanvas.setSrc(nextAction.payload.src || src));
        }
    }
}

export const sagas = [
    watchNodeCreated,
    watchCanvasUpdateToChangeTitle,
    watchStopLoading,
    watchControlOverIFrame
];
