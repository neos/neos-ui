import {takeLatest, takeEvery} from 'redux-saga';
import {put} from 'redux-saga/effects';
import {$get, $transform} from 'plow-js';

import {actionTypes, actions} from 'Host/Redux/';
import {CR} from 'Host/Selectors/';

const getNode = CR.Nodes.byContextPathSelector;

const getTransientInspectorValues = $get(['ui', 'inspector', 'valuesByNodePath']);


export function* applyInspectorState(getState) {
    yield* takeEvery(actionTypes.UI.Inspector.APPLY, function* applyAllChanges (action) {
        const state = getState();
        const {nodeContextPath} = action.payload;
        const node = getNode(nodeContextPath)(state);

        const transientNodeInspectorValues = $get([nodeContextPath], getTransientInspectorValues(state));

        for (let key of Object.keys(transientNodeInspectorValues)) {
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