import {select, take, put} from 'redux-saga/effects';
import {$get} from 'plow-js';
import {actions, actionTypes, selectors} from '@neos-project/neos-ui-redux-store';
import backend from '@neos-project/neos-ui-backend-connector';

export function * watchNodeInformationChanges() {
    const {endpoints} = backend.get();
    while (true) {
        const action = yield take([actionTypes.CR.Nodes.MERGE, actionTypes.CR.Nodes.ADD]);
        const {nodeMap} = action.payload;
        const state = yield select();

        const nodesWithoutPolicies = Object.keys(nodeMap).filter(contextPath => {
            const node = selectors.CR.Nodes.nodeByContextPath(state)(contextPath);

            if (!$get('isFullyLoaded', node) || $get('properties._removed', node)) {
                return false;
            }

            const policyInfo = $get('policy', node);
            return (!policyInfo);
        });

        if (nodesWithoutPolicies.length === 0) {
            continue;
        }

        const policyData = yield endpoints.getPolicyInfo(nodesWithoutPolicies);
        yield put(actions.CR.Nodes.merge(policyData));
    }
}

