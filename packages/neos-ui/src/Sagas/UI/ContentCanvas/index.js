import {takeLatest} from 'redux-saga';
import {put, select} from 'redux-saga/effects';
import {$get} from 'plow-js';

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

export const sagas = [
    watchNodeCreated
];
