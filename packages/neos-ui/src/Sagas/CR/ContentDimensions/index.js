import {takeLatest} from 'redux-saga';
import {put, select} from 'redux-saga/effects';

import {actions, actionTypes, selectors} from '@neos-project/neos-ui-redux-store';
import {api} from '@neos-project/neos-ui-backend-connector';

function * updateContentCanvasSrc() {
    const activeDimensions = yield select(selectors.CR.ContentDimensions.active);
    const contextPath = yield select(selectors.CR.Nodes.currentDocumentNode);

    const {q} = api.get();
    const nodes = yield q(contextPath).context(
        {
            dimensions: activeDimensions.toJS(),
            targetDimensions: activeDimensions.map(dimensionValues => dimensionValues[0]).toJS()
        }
    ).get(0);

    if (nodes.length > 0) {
        const [node] = nodes;
        yield put(actions.UI.ContentCanvas.setSrc(node.uri));
    } else {
        console.log('TODO Show modal dialog with translation options');
    }
}

function * watchSelectPreset() {
    // Only process the latest selection and cancel previous ones
    yield * takeLatest(actionTypes.CR.ContentDimensions.SELECT_PRESET, updateContentCanvasSrc);
}

export const sagas = [
    watchSelectPreset
];
