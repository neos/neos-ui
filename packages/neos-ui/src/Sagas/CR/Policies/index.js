import {select, take, put} from 'redux-saga/effects';
import {$get} from 'plow-js';
import {actions, actionTypes, selectors} from '@neos-project/neos-ui-redux-store';
import backend from '@neos-project/neos-ui-backend-connector';

export function * watchNodeFocus() {
    const {endpoints} = backend.get();
    let runningRequests = [];
    while (true) {
        const action = yield take([actionTypes.UI.ContentCanvas.SET_CONTEXT_PATH, actionTypes.CR.Nodes.FOCUS]);
        const {contextPath} = action.payload;
        if (runningRequests.includes(contextPath)) {
            continue;
        }

        runningRequests.push(contextPath);

        const getNodeByContextPathSelector = selectors.CR.Nodes.makeGetNodeByContextPathSelector(contextPath);
        const node = select(getNodeByContextPathSelector);
        const policyInfo = $get('policy', node);
        if (policyInfo && policyInfo !== false) {
            runningRequests = runningRequests.filter(item => item !== contextPath);
            continue;
        }

        const policyData = yield endpoints.getPolicyInfo([contextPath]);
        runningRequests = runningRequests.filter(item => item !== contextPath);
        yield put(actions.CR.Nodes.merge(policyData));
    }
}

export function * watchMergeFromGuestFrame() {
    const {endpoints} = backend.get();
    while (true) {
        const action = yield take(actionTypes.CR.Nodes.MERGE_FROM_GUEST_FRAME);
        const {nodeMap} = action.payload;

        const nodesWithoutPolicies = Object.keys(nodeMap).filter(contextPath => {
            const getNodeByContextPathSelector = selectors.CR.Nodes.makeGetNodeByContextPathSelector(contextPath);
            const node = select(getNodeByContextPathSelector);
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

