import {takeEvery} from 'redux-saga';
import {put} from 'redux-saga/effects';
import {$get} from 'plow-js';

import {actionTypes, actions} from 'Host/Redux/';

const getTransientInspectorValues = $get(['ui', 'inspector', 'valuesByNodePath']);

export function* applyInspectorState(getState) {
    yield* takeEvery(actionTypes.UI.Inspector.APPLY, function* applyAllChanges(action) {
        const state = getState();
        const {nodeContextPath} = action.payload;

        const transientNodeInspectorValues = $get([nodeContextPath, 'nodeProperties'], getTransientInspectorValues(state));

        for (const key of Object.keys(transientNodeInspectorValues)) {
            yield put(actions.Changes.add({
                type: 'PackageFactory.Guevara:Property',
                subject: nodeContextPath,
                payload: {
                    propertyName: key,
                    value: transientNodeInspectorValues[key]
                }
            }));
        }

        yield put(actions.UI.Inspector.applyFinished(nodeContextPath));
    });
}
