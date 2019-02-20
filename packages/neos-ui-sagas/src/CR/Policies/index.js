import {select, take, put, fork} from 'redux-saga/effects';
import {$get} from 'plow-js';
import {actions, actionTypes, selectors} from '@neos-project/neos-ui-redux-store';
import backend from '@neos-project/neos-ui-backend-connector';

let nodesCurrentlyProcessed = [];

function * fetchLazyData(nodesWithoutLazyData) {
    const nodesNotProcessed = nodesWithoutLazyData.filter(nodePath => !nodesCurrentlyProcessed.includes(nodePath));
    if (nodesNotProcessed.length === 0) {
        return;
    }

    nodesCurrentlyProcessed.push(...nodesWithoutLazyData);

    const {endpoints} = backend.get();
    const lazyData = yield endpoints.getLazyNodeData(nodesWithoutLazyData);
    if (lazyData) {
        yield put(actions.CR.Nodes.merge(lazyData));
        nodesCurrentlyProcessed = nodesCurrentlyProcessed.filter(nodePath => !nodesWithoutLazyData.includes(nodePath));
    }
}

export function * watchNodeInformationChanges() {
    while (true) {
        const action = yield take([actionTypes.CR.Nodes.MERGE, actionTypes.CR.Nodes.ADD, actionTypes.CR.Nodes.SET_STATE]);
        const nodeMap = (action.type === actionTypes.CR.Nodes.SET_STATE) ? action.payload.nodes : action.payload.nodeMap;
        const state = yield select();

        const nodesWithoutLazyData = Object.keys(nodeMap).filter(contextPath => {
            const node = selectors.CR.Nodes.nodeByContextPath(state)(contextPath);

            if ($get('properties._removed', node)) {
                return false;
            }

            const policyInfo = $get('policy', node);
            return (!policyInfo);
        });

        if (nodesWithoutLazyData.length === 0) {
            continue;
        }

        yield fork(fetchLazyData, nodesWithoutLazyData);
    }
}

