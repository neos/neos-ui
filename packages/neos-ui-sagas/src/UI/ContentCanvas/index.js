import {delay} from 'redux-saga';
import {takeLatest, put, select, take, race} from 'redux-saga/effects';
import {$get} from 'plow-js';
import {getGuestFrameDocument} from '@neos-project/neos-ui-guest-frame/src/dom';

import {actionTypes, actions} from '@neos-project/neos-ui-redux-store';

/**
 * Load newly created page into canvas
 */
export function * watchNodeCreated() {
    yield takeLatest(actionTypes.UI.Remote.DOCUMENT_NODE_CREATED, function * nodeCreated(action) {
        const {contextPath} = action.payload;
        const node = yield select($get(['cr', 'nodes', 'byContextPath', contextPath]));
        yield put(actions.CR.Nodes.setDocumentNode(contextPath));
        yield put(actions.UI.ContentCanvas.setSrc($get('uri', node)));
    });
}
/**
 * Load newly created page into canvas
 */
export function * watchCanvasUpdateToChangeTitle() {
    yield takeLatest(actionTypes.UI.ContentCanvas.STOP_LOADING, () => {
        document.title = getGuestFrameDocument().title;
    });
}

/**
 * Run initialization sequence, after a new document has been loaded
 */
export function * watchStopLoading({globalRegistry, store}) {
    const guestFrameRegistry = globalRegistry.get('@neos-project/neos-ui-guest-frame');
    const makeInitializeGuestFrame = guestFrameRegistry.get('makeInitializeGuestFrame');

    yield takeLatest(
        actionTypes.UI.ContentCanvas.STOP_LOADING,
        makeInitializeGuestFrame({globalRegistry, store})
    );
}

/**
 * Reload content canvas when requested
 */
export function * watchReload() {
    yield takeLatest(actionTypes.UI.ContentCanvas.RELOAD, function * (action) {
        const {uri} = action.payload;
        const currentIframeUrl = yield select($get('ui.contentCanvas.src'));

        [].slice.call(document.querySelectorAll(`iframe[name=neos-content-main]`)).forEach(iframe => {
            const iframeWindow = iframe.contentWindow || iframe;

            //
            // Make sure href is still consistent before reloading - if not, some other process
            // might be already handling this.
            // If the new uri is provided in the action payload, use that
            //
            if (iframeWindow.location.href === currentIframeUrl) {
                iframeWindow.location.href = uri || iframeWindow.location.href;
            }
        });
    });
}

export function * watchControlOverIFrame() {
    yield take(actionTypes.System.READY);

    while (true) { //eslint-disable-line
        const src = yield select($get('ui.contentCanvas.src'));
        const waitForNextAction = yield race([
            take(actionTypes.UI.ContentCanvas.SET_SRC),
            take(actionTypes.UI.ContentCanvas.REQUEST_REGAIN_CONTROL),
            take(actionTypes.UI.ContentCanvas.REQUEST_LOGIN)
        ]);
        const nextAction = Object.keys(waitForNextAction).map(k => waitForNextAction[k])[0];

        if (nextAction.type === actionTypes.UI.ContentCanvas.REQUEST_REGAIN_CONTROL) {
            yield put(actions.UI.FlashMessages.add('iframe access', nextAction.payload.errorMessage, 'error', 5000));

            //
            // We need to delay, so that the iframe gets cleared before we load a new src
            //
            yield delay(0);
            yield put(actions.UI.ContentCanvas.setSrc(nextAction.payload.src || src));
            continue;
        }

        if (nextAction.type === actionTypes.UI.ContentCanvas.REQUEST_LOGIN) {
            yield put(actions.System.authenticationTimeout());
            yield take(actionTypes.System.REAUTHENTICATION_SUCCEEDED);

            //
            // We need to delay, so that the iframe gets cleared before we load a new src
            //
            yield put(actions.UI.ContentCanvas.setSrc(''));
            yield delay(0);
            yield put(actions.UI.ContentCanvas.setSrc(src));
            continue;
        }
    }
}

